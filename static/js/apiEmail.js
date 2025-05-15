(function() {
        emailjs.init("LJlOAIoXqpRG-ZoR5");
      })();

      
      document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactForm');
        const messageContainer = document.getElementById('signupMessage');
        
       
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
         
          if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
          }
          
        
          const submitButton = form.querySelector('.button-submit');
          const originalButtonText = submitButton.innerHTML;
          submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
          submitButton.disabled = true;
          
          
          const templateParams = {
            from_name: document.getElementById('fullname_form').value,
            reply_to: document.getElementById('email_form').value,
            phone: document.getElementById('phone_form').value || 'No proporcionado',
            message: document.getElementById('message_form').value
          };
          
          // Enviar el email 
          emailjs.send(
            'service_rgwky6a',  
            'template_v3wrphb', 
            templateParams
          )
          .then(function(response) {
            console.log('¡ÉXITO!', response.status, response.text);
            showMessage('¡Mensaje enviado correctamente! Te responderemos a la brevedad.', 'success');
            form.reset(); 
          })
          .catch(function(error) {
            console.log('ERROR:', error);
            showMessage('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.', 'danger');
          })
          .finally(function() {
            // Restaurar el botón
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
          });
        });
        
        // Función para mostrar mensajes
        function showMessage(text, type) {
          messageContainer.textContent = text;
          messageContainer.className = `alert alert-${type}`;
          messageContainer.classList.remove('d-none');
          
          // Desplazar a la alerta
          messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Ocultar el mensaje después de 5 segundos
          setTimeout(() => {
            messageContainer.classList.add('d-none');
          }, 5000);
        }
      });