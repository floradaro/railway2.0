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
    const messageProfile = document.getElementById('profileMessage');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function () {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            if (!fullname || !email) {
                messageProfile.classList.remove('d-none', 'alert-success');
                messageProfile.classList.add('alert-danger');
                messageProfile.textContent = 'Las contraseñas no coinciden';
                return;
            }

            fetch(`/update_profile/${currentUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error al actualizar el perfil');
                    return res.json();
                })
                .then(() => {
                    messageProfile.classList.remove('d-none', 'alert-danger');
                    messageProfile.classList.add('alert-success');
                    messageProfile.textContent = 'Perfil actualizado correctamente';
                })
                .catch(err => {
                    messageProfile.classList.remove('d-none', 'alert-success');
                    messageProfile.classList.add('alert-danger');
                    messageProfile.textContent = err.message;
                });
        });
    }

    
    // ───── CAMBIO DE CONTRASEÑA ────────────────────
    const editPasswordBtn = document.getElementById('editPasswordBtn');
    // Verificamos si existe el elemento para mostrar mensajes
    // Si no existe, lo creamos justo después del botón
    let messagePassword = document.getElementById('passwordMessage');
    if (!messagePassword && editPasswordBtn) {
        messagePassword = document.createElement('div');
        messagePassword.id = 'passwordMessage';
        messagePassword.className = 'alert mt-3 d-none';
        editPasswordBtn.parentNode.insertBefore(messagePassword, editPasswordBtn.nextSibling);
    }
    
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener('click', function () {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            
            // Seleccionar correctamente los campos de contraseña por su nombre
            const passwordInputs = document.querySelectorAll('input[name="password"]');
            const current = passwordInputs.length > 0 ? passwordInputs[0].value : '';
            
            const newPasswordInput = document.querySelector('input[name="newPassword"]');
            const confirmNewPasswordInput = document.querySelector('input[name="confirmNewPassword"]');
            
            const nueva = newPasswordInput ? newPasswordInput.value : '';
            const confirmar = confirmNewPasswordInput ? confirmNewPasswordInput.value : '';
            
            if (!current || !nueva || !confirmar) {
                if (messagePassword) {
                    messagePassword.classList.remove('d-none', 'alert-success');
                    messagePassword.classList.add('alert-danger');
                    messagePassword.textContent = 'Por favor, complete todos los campos';
                } else {
                    alert('Por favor, complete todos los campos');
                }
                return;
            }
            
            if (nueva !== confirmar) {
                if (messagePassword) {
                    messagePassword.classList.remove('d-none', 'alert-success');
                    messagePassword.classList.add('alert-danger');
                    messagePassword.textContent = 'Las contraseñas nuevas no coinciden';
                } else {
                    alert('Las contraseñas nuevas no coinciden');
                }
                return;
            }

            fetch(`/update_password/${currentUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: current, new_password: nueva })
            })
                .then(res => {
                    if (!res.ok) return res.json().then(data => { throw new Error(data.message || 'Error al actualizar la contraseña'); });
                    return res.json();
                })
                .then(() => {
                    if (messagePassword) {
                        messagePassword.classList.remove('d-none', 'alert-danger');
                        messagePassword.classList.add('alert-success');
                        messagePassword.textContent = 'Contraseña actualizada correctamente';
                    } else {
                        alert('Contraseña actualizada exitosamente');
                    }
                    
                    // Limpiar los campos después de actualizar
                    if (passwordInputs.length > 0) passwordInputs[0].value = '';
                    if (newPasswordInput) newPasswordInput.value = '';
                    if (confirmNewPasswordInput) confirmNewPasswordInput.value = '';
                })
                .catch(err => {
                    if (messagePassword) {
                        messagePassword.classList.remove('d-none', 'alert-success');
                        messagePassword.classList.add('alert-danger');
                        messagePassword.textContent = err.message;
                    } else {
                        alert(err.message);
                    }
                });
        });
    }

    // ───── ELIMINAR PERFIL ─────────────────────────
    const deleteProfileBtn = document.getElementById('deleteProfileBtn'); // Corrección: usar el ID correcto
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deletePassword = document.getElementById('deletePassword');
    const modalElement = document.getElementById('deleteModal');
    
    if (deleteProfileBtn && confirmDeleteBtn && deletePassword && modalElement) {
        const deleteModal = new bootstrap.Modal(modalElement);

        deleteProfileBtn.addEventListener('click', () => {
            if (!currentUserId) return alert('No se pudo identificar el usuario actual');
            deletePassword.value = '';
            deleteModal.show();
        });

        confirmDeleteBtn.addEventListener('click', () => {
            const password = deletePassword.value.trim();
            if (!password) return alert('Debe ingresar su contraseña');
            
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
                    deleteModal.hide(); // Ocultar el modal después de eliminar
                    window.location.href = '/logout';
                })
                .catch(err => {
                    alert('Error al eliminar el perfil: ' + err.message);
                    deleteModal.hide(); // Ocultar el modal si hay error
                });
        });
        
        // Agregar este evento para el botón de cancelar
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.hide();
            });
        }
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