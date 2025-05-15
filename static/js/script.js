document.addEventListener('DOMContentLoaded', function() {

    checkLoginStatus();
    loadCurrentUser();
    
    // Variable global para guardar el ID del usuario actual
    let currentUserId = null;

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
    }

    function loadCurrentUser() {
        fetch('/current_user')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No autenticado o error al obtener el usuario');
                }
                return response.json();
            })
            .then(user => {
                console.log('Usuario recibido:', user);
    
                // Guardar el ID del usuario actual
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
    
    // Modificar perfil
    const editProfileBtn = document.getElementById('editProfileBtn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (!currentUserId) {
            alert('Error: No se pudo identificar el usuario actual');
            return;
        }
        
        // Obtener los valores actualizados de los campos del formulario
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        
        // Verificar que los campos no estén vacíos
        if (!fullname || !email) {
            alert('Por favor, complete todos los campos obligatorios');
            return;
        }
        
        // Enviar la solicitud de actualización
        fetch(`/update_profile/${currentUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname: fullname,
                email: email
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }
            return response.json();
        })
        .then(data => {
            alert('Perfil actualizado exitosamente');
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
            alert('Error al actualizar el perfil: ' + error.message);
        });
    });
}

// Cambiar contraseña
const editPasswordBtn = document.getElementById('editPasswordBtn');
if (editPasswordBtn) {
    editPasswordBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (!currentUserId) {
            alert('Error: No se pudo identificar el usuario actual');
            return;
        }
        
        // Obtener los valores de contraseña
        const currentPassword = document.getElementById('password').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validaciones básicas
        if (!currentPassword) {
            alert('Por favor, ingrese su contraseña actual');
            return;
        }
        
        if (!newPassword) {
            alert('Por favor, ingrese su nueva contraseña');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            alert('Las contraseñas nuevas no coinciden');
            return;
        }
        
        // Enviar la solicitud de actualización de contraseña
        fetch(`/update_password/${currentUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error al actualizar la contraseña');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Contraseña actualizada exitosamente');
            // Limpiar los campos de contraseña
            document.getElementById('password').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        })
        .catch(error => {
            console.error('Error al actualizar la contraseña:', error);
            alert(error.message);
        });
    });
}

    
   const deleteProfileBtn = document.querySelector('.btn-danger');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const passwordInput = document.getElementById('deletePassword');

    if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (!currentUserId) {
                alert('Error: No se pudo identificar el usuario actual');
                return;
            }

            // Mostrar modal de Bootstrap
            passwordInput.value = ''; // Limpiar campo de contraseña
            deleteModal.show();
        });
    }

    confirmBtn.addEventListener('click', function () {
        const password = passwordInput.value.trim();

        if (!password) {
            alert('Debe ingresar su contraseña');
            return;
        }

        // Ocultar el modal
        deleteModal.hide();

        // Enviar solicitud DELETE con contraseña (si tu backend lo acepta)
        fetch(`/users/${currentUserId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password }) // solo si el backend lo requiere
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el perfil');
                }
                return response.json();
            })
            .then(data => {
                alert('Perfil eliminado exitosamente');
                window.location.href = '/logout';
            })
            .catch(error => {
                console.error('Error al eliminar el perfil:', error);
                alert('Error al eliminar el perfil: ' + error.message);
            });
    });


    
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
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input && input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else if (input) {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
});

    //Funcionalidad para botón de registrarse
document.getElementById('registrarseBtn').addEventListener('click', () => {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    const mensajeError = document.getElementById('mensajeError');

    if (!email) {
      mensajeError.textContent = 'Por favor ingresá un correo válido.';
      return;
    }

    // Si todo está bien, limpiamos el mensaje y redirigimos
    mensajeError.textContent = '';
    const url = '/signup?email=' + encodeURIComponent(email);
    window.location.href = url;
  });
