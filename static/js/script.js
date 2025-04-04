document.addEventListener('DOMContentLoaded', function() {

    checkLoginStatus();
    // Función para verificar el estado de inicio de sesión
    function checkLoginStatus() {
        fetch('/check_login_status', {
            method: 'GET',
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                // El usuario está autenticado
                document.querySelectorAll('.logged-in-only').forEach(el => {
                    el.style.display = 'block';
                });
                document.querySelectorAll('.logged-out-only').forEach(el => {
                    el.style.display = 'none';
                });
            } else {
                // El usuario no está autenticado
                document.querySelectorAll('.logged-in-only').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelectorAll('.logged-out-only').forEach(el => {
                    el.style.display = 'block';
                });
            }
        })
        .catch(error => {
            console.error('Error al verificar estado de sesión:', error);
        });
    }

    // Formulario de registro
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageDiv = document.getElementById('signupMessage');
            
            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                messageDiv.classList.remove('d-none', 'alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = 'Las contraseñas no coinciden';
                return;
            }
            
            // Realizar la llamada a la API para crear el usuario
            fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullname, email, password })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al crear la cuenta');
            })
            .then(data => {
                // Mostrar mensaje de éxito
                messageDiv.classList.remove('d-none', 'alert-danger');
                messageDiv.classList.add('alert-success');
                messageDiv.textContent = 'Cuenta creada exitosamente';
                
                //Redirigir a home
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            })
            .catch(error => {
                // Mostrar mensaje de error
                messageDiv.classList.remove('d-none', 'alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = error.message;
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('loginMessage');
            
            // Realizar la llamada a la API para iniciar sesión
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Email o contraseña inválida');
            })
            .then(data => {
                // Mostrar mensaje de éxito
                messageDiv.classList.remove('d-none', 'alert-danger');
                messageDiv.classList.add('alert-success');
                messageDiv.textContent = 'Inicio de sesión exitoso';
                
                // Redirigir a la página principal después de un breve retraso
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            })
            .catch(error => {
                // Mostrar mensaje de error
                messageDiv.classList.remove('d-none', 'alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = error.message;
            });
        });
    }
 
    // Cargar la lista de usuarios
    function loadUsers() {
        const userList = document.getElementById('userList');
        if (!userList) return; // Si no existe el elemento, salir de la función
        
        fetch('/users')
            .then(response => response.json())
            .then(users => {
                userList.innerHTML = ''; // Limpiar la lista actual
        
                users.forEach(user => {
                    const userId = user.id || user[0];
                    const userName = user.fullname || user[1];
                    const userEmail = user.email || user[2];
                    
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${userName} (${userEmail}) 
                        <button onclick="editUser(${userId})">Editar</button>
                        <button onclick="deleteUser(${userId})">Eliminar</button>
                    `;
                    userList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
            });
    }
    
    
    // Editar un usuario
    function editUser(id) {
        // Obtenemos los datos actuales del usuario
        fetch(`/users/${id}`)
            .then(response => response.json())
            .then(user => {
                const currentName = user.fullname || user[1];
                const currentEmail = user.email || user[2];
                
                // Solicitamos los nuevos valores al usuario
                const newName = prompt('Nuevo nombre:', currentName);
                const newEmail = prompt('Nuevo email:', currentEmail);
                const newPassword = prompt('Nueva contraseña (dejar en blanco para mantener la actual):');
                
                if (!newName || !newEmail) return;
                
                // Si el usuario no ingresó una nueva contraseña, usamos la actual
                const password = newPassword || user.password || user[3];
                
                fetch(`/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        fullname: newName, 
                        email: newEmail, 
                        password: password 
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Error en la respuesta del servidor');
                })
                .then(data => {
                    alert(data.message || 'Usuario actualizado exitosamente');
                    loadUsers(); // Recargar la lista de usuarios
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al actualizar el usuario');
                });
            })
            .catch(error => {
                console.error('Error al obtener datos del usuario:', error);
                alert('Error al obtener datos del usuario');
            });
    }
    
    // Eliminar un usuario
    function deleteUser(id) {
        const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar este usuario?`);
        if (!confirmDelete) return;
    
        fetch(`/users/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers(); // Recargar la lista de usuarios
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el usuario');
        });
    }
    
    // Cargar los usuarios al cargar la página
    loadUsers();
    
    // Funcionalidad para el botón de búsqueda
    if (document.getElementById("searchBtn")) {
        document.getElementById("searchBtn").addEventListener("click", function () {
            var searchInput = document.getElementById("searchInput");
            if (searchInput.style.display === "none") {
                searchInput.style.display = "block";
            } else {
                searchInput.style.display = "none";
            }
        });
    }
    
    // Funcionalidad para el botón de mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
});