document.addEventListener('DOMContentLoaded', function () {
    let currentUserId = null;

    // ───── FUNCIONES ──────────────────────────────
    function checkLoginStatus() {
        fetch('/check_login_status', { method: 'GET', credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                document.querySelectorAll('.logged-in-only').forEach(el => el.style.display = data.logged_in ? 'block' : 'none');
                document.querySelectorAll('.logged-out-only').forEach(el => el.style.display = data.logged_in ? 'none' : 'block');
            })
            .catch(err => console.error('Error al verificar estado de sesión:', err));
    }

    function loadCurrentUser() {
        fetch('/current_user')
            .then(response => {
                if (!response.ok) throw new Error('No autenticado o error al obtener el usuario');
                return response.json();
            })
            .then(user => {
                currentUserId = user.id;
                const fullnameInput = document.getElementById('fullname');
                const emailInput = document.getElementById('email');
                if (fullnameInput) fullnameInput.value = user.fullname || user.name || user.nombre || '';
                if (emailInput) emailInput.value = user.email || '';
            })
            .catch(error => {
                console.error('Error al cargar el usuario actual:', error);
            });
    }

    function togglePasswordVisibility() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                if (!input || !icon) return;
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            });
        });
    }

    // ───── INICIO DE SESIÓN ────────────────────────
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('loginMessage');

            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Email o contraseña inválida');
                    return res.json();
                })
                .then(() => {
                    messageDiv.classList.remove('d-none', 'alert-danger');
                    messageDiv.classList.add('alert-success');
                    messageDiv.textContent = 'Inicio de sesión exitoso';
                    setTimeout(() => window.location.href = '/', 1500);
                })
                .catch(error => {
                    messageDiv.classList.remove('d-none', 'alert-success');
                    messageDiv.classList.add('alert-danger');
                    messageDiv.textContent = error.message;
                });
        });
    }

    // ───── REGISTRO ────────────────────────────────
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageDiv = document.getElementById('signupMessage');

            if (password !== confirmPassword) {
                messageDiv.classList.remove('d-none', 'alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = 'Las contraseñas no coinciden';
                return;
            }

            fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al crear la cuenta');
                    return res.json();
                })
                .then(() => {
                    messageDiv.classList.remove('d-none', 'alert-danger');
                    messageDiv.classList.add('alert-success');
                    messageDiv.textContent = 'Cuenta creada exitosamente';
                    setTimeout(() => window.location.href = '/', 2000);
                })
                .catch(error => {
                    messageDiv.classList.remove('d-none', 'alert-success');
                    messageDiv.classList.add('alert-danger');
                    messageDiv.textContent = error.message;
                });
        });
    }

    // ───── EDITAR PERFIL ───────────────────────────
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function () {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            if (!fullname || !email) return alert('Por favor, complete todos los campos');

            fetch(`/update_profile/${currentUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al actualizar el perfil');
                    return res.json();
                })
                .then(() => alert('Perfil actualizado exitosamente'))
                .catch(err => alert('Error al actualizar el perfil: ' + err.message));
        });
    }

    // ───── CAMBIO DE CONTRASEÑA ────────────────────
    const editPasswordBtn = document.getElementById('editPasswordBtn');
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener('click', function () {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            const current = document.getElementById('password').value;
            const nueva = document.getElementById('newPassword').value;
            const confirmar = document.getElementById('confirmNewPassword').value;
            if (!current || !nueva || !confirmar) return alert('Por favor, complete todos los campos');
            if (nueva !== confirmar) return alert('Las contraseñas nuevas no coinciden');

            fetch(`/update_password/${currentUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: current, new_password: nueva })
            })
                .then(res => {
                    if (!res.ok) return res.json().then(data => { throw new Error(data.message); });
                    return res.json();
                })
                .then(() => {
                    alert('Contraseña actualizada exitosamente');
                    document.getElementById('password').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmNewPassword').value = '';
                })
                .catch(error => alert(error.message));
        });
    }

    // ───── ELIMINAR PERFIL ─────────────────────────
    const deleteBtn = document.querySelector('.btn-danger');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const passwordInput = document.getElementById('deletePassword');
    const modalElement = document.getElementById('deleteModal');
    if (deleteBtn && confirmBtn && passwordInput && modalElement) {
        const deleteModal = new bootstrap.Modal(modalElement);

        deleteBtn.addEventListener('click', () => {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            passwordInput.value = '';
            deleteModal.show();
        });

        confirmBtn.addEventListener('click', () => {
            const password = passwordInput.value.trim();
            if (!password) return alert('Debe ingresar su contraseña');
            deleteModal.hide();

            fetch(`/users/${currentUserId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al eliminar el perfil');
                    return res.json();
                })
                .then(() => {
                    alert('Perfil eliminado exitosamente');
                    window.location.href = '/logout';
                })
                .catch(err => alert('Error al eliminar el perfil: ' + err.message));
        });
    }

    // ───── BÚSQUEDA ────────────────────────────────
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchInput.style.display = (searchInput.style.display === 'none') ? 'block' : 'none';
        });
    }

    // ───── BOTÓN DE REDIRECCIÓN A REGISTRO ─────────
    const registrarseBtn = document.getElementById('registrarseBtn');
    if (registrarseBtn) {
        registrarseBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('emailInput');
            const mensajeError = document.getElementById('mensajeError');
            const email = emailInput?.value.trim();

            if (!email) {
                if (mensajeError) mensajeError.textContent = 'Por favor ingresá un correo válido.';
                return;
            }

            if (mensajeError) mensajeError.textContent = '';
            window.location.href = '/signup?email=' + encodeURIComponent(email);
        });
    }

    // ───── INICIAR FUNCIONES GLOBALES ──────────────
    checkLoginStatus();
    loadCurrentUser();
    togglePasswordVisibility();
});
