// Datos de las preguntas
const questions = [
  {
    id: 1,
    text: "¿Debes más de 10.000€?",
    key: "p1"
  },
  {
    id: 2,
    text: "¿Tienes capacidad para pagar tu deuda y vivir dignamente?",
    key: "p2"
  },
  {
    id: 3,
    text: "¿Has intentado llegar a un acuerdo con acreedores?",
    key: "p3"
  }
];

// Estado de la aplicación
let currentQuestionIndex = 0;
let answers = {};
let userEmail = '';

// Elementos del DOM
let heroSection, quizSection, loadingSection, resultsSection;
let startBtn, questionText, currentQuestionEl, progressPercent, progressBar;
let answerBtns, resultContent;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Capturar email de la URL
  const urlParams = new URLSearchParams(window.location.search);
  userEmail = urlParams.get('email') || '';
  
  // Obtener elementos del DOM
  heroSection = document.getElementById('hero-section');
  quizSection = document.getElementById('quiz-section');
  loadingSection = document.getElementById('loading-section');
  resultsSection = document.getElementById('results-section');
  startBtn = document.getElementById('start-btn');
  questionText = document.getElementById('question-text');
  currentQuestionEl = document.getElementById('current-question');
  progressPercent = document.getElementById('progress-percent');
  progressBar = document.getElementById('progress-bar');
  answerBtns = document.querySelectorAll('.answer-btn');
  resultContent = document.getElementById('result-content');
  
  // Event Listeners
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
  
  if (answerBtns) {
    answerBtns.forEach(btn => {
      btn.addEventListener('click', handleAnswer);
    });
  }
  
  console.log('App de Ley Segunda Oportunidad cargada y lista');
  if (userEmail) {
    console.log('Email capturado:', userEmail);
  }
});

// Función para manejar el envío del formulario de lead
async function handleLeadSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const name = form.name.value;
  const lastname = form.lastname.value;
  const email = form.email.value;
  const phone = form.phone.value;
  
  const webhookURL = 'https://n8n.empiezadecero.cat/webhook/d8eddf79-25bf-4ebe-818e-88a667dcaac8';
  
  // AHORA enviamos el webhook completo con toda la información del lead LSO
  const payload = {
    nombre: name,
    apellido: lastname,
    email: email,
    telefono: phone,
    tag: 'LSO',  // Tag principal para LSO
    resultado: 'LEY_SEGUNDA_OPORTUNIDAD',
    respuestas: {
      pregunta1: {
        texto: "¿Debes más de 10.000€?",
        respuesta: answers.p1 ? 'SÍ' : 'NO'
      },
      pregunta2: {
        texto: "¿Tienes capacidad para pagar tu deuda y vivir dignamente?",
        respuesta: answers.p2 ? 'SÍ' : 'NO'
      },
      pregunta3: {
        texto: "¿Has intentado llegar a un acuerdo con acreedores?",
        respuesta: answers.p3 ? 'SÍ' : 'NO'
      }
    },
    timestamp: new Date().toISOString(),
    origen: 'Landing Ley Segunda Oportunidad - Lead LSO'
  };
  
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('Lead enviado exitosamente:', payload);
      // Mostrar mensaje de éxito
      form.classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    } else {
      console.error('Error al enviar lead:', response.status);
      alert('Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al conectar con el webhook:', error);
    alert('Hubo un error de conexión. Por favor, inténtalo de nuevo.');
  }
}

// Funciones
function startQuiz() {
  heroSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.text;
  currentQuestionEl.textContent = currentQuestionIndex + 1;
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressPercent.textContent = Math.round(progress);
  progressBar.style.width = `${progress}%`;
}

function handleAnswer(e) {
  const answer = e.target.dataset.answer;
  const question = questions[currentQuestionIndex];
  
  answers[question.key] = answer === 'yes';
  
  currentQuestionIndex++;
  
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showLoading();
  }
}

function showLoading() {
  quizSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
  
  setTimeout(async () => {
    await showResults();
  }, 2000);
}

async function showResults() {
  const resultType = checkQualification();
  
  // Para LSO, NO enviamos el webhook aún (esperamos el formulario)
  // Para otros resultados, enviamos inmediatamente
  if (resultType !== 'LEY_SEGUNDA_OPORTUNIDAD') {
    await sendWebhook(resultType);
  }
  
  loadingSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  displayResult(resultType);
}

// Función para enviar datos al webhook
async function sendWebhook(resultType) {
  const webhookURL = 'https://n8n.empiezadecero.cat/webhook-test/d8eddf79-25bf-4ebe-818e-88a667dcaac8';
  
  // Determinar el tag según el resultado
  let tag = '';
  switch(resultType) {
    case 'LEY_SEGUNDA_OPORTUNIDAD':
      tag = 'LSO';
      break;
    case 'NEGOCIA':
      tag = 'Negocia';
      break;
    case 'LOTERIA':
      tag = 'Loteria';
      break;
    default:
      tag = 'Resultado Desconocido';
  }
  
  const payload = {
    email: userEmail || 'No proporcionado',
    tag: tag,
    resultado: resultType,
    respuestas: {
      pregunta1: {
        texto: "¿Debes más de 10.000€?",
        respuesta: answers.p1 ? 'SÍ' : 'NO'
      },
      pregunta2: {
        texto: "¿Tienes capacidad para pagar tu deuda y vivir dignamente?",
        respuesta: answers.p2 ? 'SÍ' : 'NO'
      },
      pregunta3: {
        texto: "¿Has intentado llegar a un acuerdo con acreedores?",
        respuesta: answers.p3 ? 'SÍ' : 'NO'
      }
    },
    timestamp: new Date().toISOString(),
    origen: 'Landing Ley Segunda Oportunidad'
  };
  
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('Datos enviados al webhook exitosamente:', payload);
    } else {
      console.error('Error al enviar al webhook:', response.status);
    }
  } catch (error) {
    console.error('Error al conectar con el webhook:', error);
  }
}

function checkQualification() {
  const p1 = answers.p1; // ¿Debes más de 10.000€?
  const p2 = answers.p2; // ¿Tienes capacidad para pagar?
  const p3 = answers.p3; // ¿Has intentado acuerdo?
  
  // LEY SEGUNDA OPORTUNIDAD: Sí/No/Sí o No/No/Sí
  if ((p1 === true && p2 === false && p3 === true) || 
      (p1 === false && p2 === false && p3 === true)) {
    return 'LEY_SEGUNDA_OPORTUNIDAD';
  }
  
  // NEGOCIA CON ACREEDORES: No/No/No, Sí/No/No, Sí/Sí/No
  if ((p1 === false && p2 === false && p3 === false) ||
      (p1 === true && p2 === false && p3 === false) ||
      (p1 === true && p2 === true && p3 === false)) {
    return 'NEGOCIA';
  }
  
  // TE TOCÓ LA LOTERÍA: Sí/Sí/Sí
  if (p1 === true && p2 === true && p3 === true) {
    return 'LOTERIA';
  }
  
  // Caso por defecto (No/Sí/Sí o No/Sí/No)
  return 'NEGOCIA';
}

function displayResult(resultType) {
  if (resultType === 'LEY_SEGUNDA_OPORTUNIDAD') {
    resultContent.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-6">✅</div>
        <h2 class="text-3xl font-bold text-accent-green mb-4">
          ¡Puedes Acogerte a la Ley de Segunda Oportunidad!
        </h2>
        <p class="text-xl text-primary mb-8 font-semibold">
          Te ofrecemos un análisis COMPLETO GRATUITO para estudiar tu caso
        </p>
        
        <!-- Formulario de Captura de Lead -->
        <div class="bg-blue-50 p-6 md:p-10 rounded-xl mb-6">
          <h3 class="font-semibold text-primary mb-6 text-lg">Déjanos tus datos y te contactaremos</h3>
          <form id="lead-form" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="text-left">
                <label for="lead-name" class="block text-sm font-medium text-primary mb-1">Nombre *</label>
                <input 
                  type="text" 
                  id="lead-name" 
                  name="name" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div class="text-left">
                <label for="lead-lastname" class="block text-sm font-medium text-primary mb-1">Apellido *</label>
                <input 
                  type="text" 
                  id="lead-lastname" 
                  name="lastname" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tu apellido"
                />
              </div>
            </div>
            <div class="text-left">
              <label for="lead-email" class="block text-sm font-medium text-primary mb-1">Email *</label>
              <input 
                type="email" 
                id="lead-email" 
                name="email" 
                required
                value="${userEmail}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div class="text-left">
              <label for="lead-phone" class="block text-sm font-medium text-primary mb-1">Teléfono *</label>
              <input 
                type="tel" 
                id="lead-phone" 
                name="phone" 
                required
                pattern="[0-9]{9,15}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="612345678"
              />
            </div>
            <button type="submit" class="btn-primary w-full text-lg">
              Solicitar Análisis Gratuito
            </button>
          </form>
          <div id="form-success" class="hidden mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            ✓ ¡Gracias! Nos pondremos en contacto contigo pronto.
          </div>
        </div>
      </div>
    `;
    
    // Agregar event listener al formulario
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', handleLeadSubmit);
    }
  } else if (resultType === 'NEGOCIA') {
    resultContent.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-6">⚠️</div>
        <h2 class="text-3xl font-bold" style="color: #f59e0b; margin-bottom: 1rem;">
          Recomendamos Negociar con tus Acreedores
        </h2>
        <p class="text-xl text-text-light mb-8">
          Es importante intentar llegar a un acuerdo directo con tus acreedores antes de considerar otras opciones.
        </p>
        <div class="bg-gray-50 p-6 rounded-xl mb-8">
          <h3 class="font-semibold text-primary mb-3">Consejos para negociar:</h3>
          <ul class="text-left space-y-2 text-text-light">
            <li>→ Prepara un plan de pagos realista</li>
            <li>→ Comunícate de manera proactiva con tus acreedores</li>
            <li>→ Solicita quitas o reducciones de intereses</li>
            <li>→ Documenta todos los acuerdos por escrito</li>
          </ul>
        </div>
        <button onclick="location.reload()" class="btn-primary">
          Realizar Nueva Evaluación
        </button>
      </div>
    `;
  } else if (resultType === 'LOTERIA') {
    resultContent.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-6">🎉</div>
        <h2 class="text-3xl font-bold text-accent-green mb-4">
          ¡Que te Toque la Lotería!
        </h2>
        <p class="text-xl text-text-light mb-8">
          Tienes capacidad de pago y ya has intentado llegar a acuerdos. Tu mejor opción es continuar cumpliendo con tus compromisos.
        </p>
        <div class="bg-blue-50 p-6 rounded-xl mb-8">
          <h3 class="font-semibold text-primary mb-3">Recomendaciones:</h3>
          <ul class="text-left space-y-2 text-text-light">
            <li>✓ Mantén tus pagos al día</li>
            <li>✓ Continúa negociando mejores condiciones</li>
            <li>✓ Busca asesoramiento financiero para optimizar tus pagos</li>
          </ul>
        </div>
        <button onclick="location.reload()" class="btn-primary">
          Realizar Nueva Evaluación
        </button>
      </div>
    `;
  }
}
