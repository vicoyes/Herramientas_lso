// Configuración del cuestionario
const QUESTIONS = [
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
    text: "¿Has intentado llegar a un acuerdo con acreedores y ha sido fallido?",
    key: "p3"
  }
];

// Estado de la aplicación
let currentQuestionIndex = 0;
let answers = {
  p1: null,
  p2: null,
  p3: null
};
let userEmail = '';

// Elementos DOM
const sections = {
  hero: document.getElementById('hero-section'),
  quiz: document.getElementById('quiz-section'),
  loading: document.getElementById('loading-section'),
  results: document.getElementById('results-section')
};

const elements = {
  startBtn: document.getElementById('start-btn'),
  questionText: document.getElementById('question-text'),
  currentQuestion: document.getElementById('current-question'),
  progressPercent: document.getElementById('progress-percent'),
  progressBar: document.getElementById('progress-bar'),
  answerBtns: document.querySelectorAll('.answer-btn'),
  resultContent: document.getElementById('result-content')
};

// Inicialización
function init() {
  // Capturar email de la URL
  const urlParams = new URLSearchParams(window.location.search);
  userEmail = urlParams.get('email') || '';
  
  // Event listeners
  elements.startBtn.addEventListener('click', startQuiz);
  
  elements.answerBtns.forEach(btn => {
    btn.addEventListener('click', handleAnswer);
  });
}

// Iniciar el cuestionario
function startQuiz() {
  showSection('quiz');
  displayQuestion();
}

// Mostrar pregunta actual
function displayQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  elements.questionText.textContent = question.text;
  elements.currentQuestion.textContent = currentQuestionIndex + 1;
  
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  elements.progressPercent.textContent = Math.round(progress);
  elements.progressBar.style.width = `${progress}%`;
  
  // Animación de entrada
  const questionContainer = document.getElementById('question-container');
  questionContainer.classList.remove('fade-in');
  void questionContainer.offsetWidth; // Trigger reflow
  questionContainer.classList.add('fade-in');
}

// Manejar respuesta
function handleAnswer(e) {
  const answer = e.target.dataset.answer === 'yes';
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  
  answers[currentQuestion.key] = answer;
  
  // Verificar si hay más preguntas
  if (currentQuestionIndex < QUESTIONS.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    // Todas las preguntas respondidas
    processResults();
  }
}

// Procesar resultados según la matriz
function processResults() {
  showSection('loading');
  
  // Simular análisis (2-3 segundos)
  setTimeout(async () => {
    const result = calculateResult();
    
    // Enviar datos al webhook si es necesario
    if (result.type === 'LEY_SEGUNDA_OPORTUNIDAD') {
      await sendWebhook(result);
    }
    
    showResult(result);
  }, 2500);
}

// Calcular resultado según la matriz lógica
function calculateResult() {
  const { p1, p2, p3 } = answers;
  
  // Regla crítica: Si P3 es NO, siempre es NEGOCIA
  if (p3 === false) {
    return {
      type: 'NEGOCIA',
      title: 'Recomendamos Negociar con tus Acreedores',
      message: 'Antes de acogerte a la Ley de Segunda Oportunidad, es importante intentar llegar a un acuerdo directo con tus acreedores.'
    };
  }
  
  // P3 es SÍ, revisar otras condiciones
  // LEY SEGUNDA OPORTUNIDAD: (SÍ/NO/SÍ) o (NO/NO/SÍ)
  if ((p1 === true && p2 === false && p3 === true) || 
      (p1 === false && p2 === false && p3 === true)) {
    return {
      type: 'LEY_SEGUNDA_OPORTUNIDAD',
      title: '¡Puedes Acogerte a la Ley de Segunda Oportunidad!',
      message: 'Según tus respuestas, cumples con el perfil para beneficiarte de esta ley.'
    };
  }
  
  // PERFIL NO APTO: (SÍ/SÍ/SÍ)
  if (p1 === true && p2 === true && p3 === true) {
    return {
      type: 'NO_APTO',
      title: 'Perfil No Cualificado',
      message: 'Según tus respuestas, actualmente no cumples con el perfil requerido para la Ley de Segunda Oportunidad.'
    };
  }
  
  // Fallback a NEGOCIA
  return {
    type: 'NEGOCIA',
    title: 'Recomendamos Negociar con tus Acreedores',
    message: 'La mejor opción en tu caso es intentar llegar a un acuerdo directo con tus acreedores.'
  };
}

// Enviar datos al webhook
async function sendWebhook(result) {
  const webhookURL = 'YOUR_WEBHOOK_URL_HERE'; // Configurar el webhook
  
  const payload = {
    email: userEmail,
    answers: {
      question1: answers.p1 ? 'SÍ' : 'NO',
      question2: answers.p2 ? 'SÍ' : 'NO',
      question3: answers.p3 ? 'SÍ' : 'NO'
    },
    result: result.type,
    timestamp: new Date().toISOString()
  };
  
  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error enviando webhook:', error);
  }
}

// Mostrar resultado
function showResult(result) {
  let content = '';
  
  if (result.type === 'LEY_SEGUNDA_OPORTUNIDAD') {
    content = `
      <div class="text-center">
        <div class="text-6xl mb-4">✓</div>
        <h2 class="text-3xl font-bold text-accent-green mb-4">${result.title}</h2>
        <p class="text-lg text-[#636e88] mb-8">${result.message}</p>
        
        <div class="bg-background-light p-6 rounded-xl mb-6">
          <h3 class="text-xl font-semibold text-primary mb-4">
            Te ofrecemos un Análisis COMPLETO GRATUITO para estudiar tu caso
          </h3>
          
          <form id="lead-form" class="max-w-md mx-auto space-y-4">
            <input 
              type="text" 
              id="nombre" 
              placeholder="Nombre completo" 
              required 
              class="input-field"
            >
            <input 
              type="tel" 
              id="telefono" 
              placeholder="Teléfono" 
              required 
              class="input-field"
            >
            <input 
              type="email" 
              id="email" 
              placeholder="Email" 
              value="${userEmail}"
              required 
              class="input-field"
            >
            <button type="submit" class="btn-primary w-full">
              Solicitar Análisis Gratuito
            </button>
          </form>
        </div>
        
        <p class="text-sm text-[#636e88]">
          O contáctanos por WhatsApp: 
          <a href="https://wa.me/YOUR_PHONE_NUMBER" target="_blank" class="text-secondary hover:underline font-semibold">
            Hablar con un asesor
          </a>
        </p>
      </div>
    `;
  } else if (result.type === 'NEGOCIA') {
    content = `
      <div class="text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-3xl font-bold text-accent-yellow mb-4">${result.title}</h2>
        <p class="text-lg text-[#636e88] mb-8">${result.message}</p>
        
        <div class="bg-background-light p-6 rounded-xl mb-6">
          <h3 class="text-xl font-semibold text-primary mb-4">
            Consejos para negociar con tus acreedores:
          </h3>
          <ul class="text-left space-y-2 max-w-lg mx-auto text-[#636e88]">
            <li>✓ Prepara un plan de pagos realista</li>
            <li>✓ Comunícate de manera proactiva</li>
            <li>✓ Solicita quitas o reducciones de intereses</li>
            <li>✓ Documenta todos los acuerdos por escrito</li>
          </ul>
        </div>
        
        <button onclick="location.reload()" class="btn-secondary">
          Volver a evaluar
        </button>
      </div>
    `;
  } else { // NO_APTO
    content = `
      <div class="text-center">
        <div class="text-6xl mb-4">✗</div>
        <h2 class="text-3xl font-bold text-accent-red mb-4">${result.title}</h2>
        <p class="text-lg text-[#636e88] mb-8">${result.message}</p>
        
        <div class="bg-background-light p-6 rounded-xl mb-6">
          <p class="text-[#636e88]">
            Si tu situación cambia en el futuro, puedes volver a realizar la evaluación.
          </p>
        </div>
        
        <button onclick="location.reload()" class="btn-secondary">
          Realizar nueva evaluación
        </button>
      </div>
    `;
  }
  
  elements.resultContent.innerHTML = content;
  
  // Si hay formulario, agregar event listener
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', handleLeadSubmit);
  }
  
  showSection('results');
}

// Manejar envío del formulario de leads
async function handleLeadSubmit(e) {
  e.preventDefault();
  
  const formData = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    origen: 'Ley Segunda Oportunidad - Landing'
  };
  
  // Aquí se integraría con HubSpot
  // Por ahora solo mostramos confirmación
  alert('¡Gracias! En breve nos pondremos en contacto contigo.');
  
  // Opcional: Enviar a HubSpot API
  // await sendToHubSpot(formData);
}

// Función auxiliar para mostrar secciones
function showSection(section) {
  Object.keys(sections).forEach(key => {
    sections[key].classList.add('hidden');
  });
  sections[section].classList.remove('hidden');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

export { init, calculateResult, sendWebhook };
