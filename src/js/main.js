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

// Elementos del DOM
let heroSection, quizSection, loadingSection, resultsSection;
let startBtn, questionText, currentQuestionEl, progressPercent, progressBar;
let answerBtns, resultContent;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
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
});

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
  
  setTimeout(showResults, 2000);
}

function showResults() {
  loadingSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  
  const qualifies = checkQualification();
  displayResult(qualifies);
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
        <p class="text-xl text-text-light mb-8">
          Basándonos en tus respuestas, cumples con el perfil para beneficiarte de esta ley y cancelar tus deudas legalmente.
        </p>
        <div class="bg-blue-50 p-6 rounded-xl mb-8">
          <h3 class="font-semibold text-primary mb-3">Próximos Pasos:</h3>
          <ul class="text-left space-y-2 text-text-light">
            <li>✓ Consulta con un abogado especializado</li>
            <li>✓ Reúne la documentación de tus deudas</li>
            <li>✓ Prepara evidencia de tus intentos de pago</li>
          </ul>
        </div>
        <button onclick="location.reload()" class="btn-primary">
          Realizar Nueva Evaluación
        </button>
      </div>
    `;
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
