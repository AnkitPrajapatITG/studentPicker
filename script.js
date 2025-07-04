document.addEventListener('DOMContentLoaded', function () {
  const studentGrid = document.getElementById('student-grid');
  const pickStudentBtn = document.getElementById('pick-student-btn');
  const pickTaskBtn = document.getElementById('pick-task-btn');
  const resetBtn = document.getElementById('reset-btn');
  const resultDisplay = document.getElementById('result');
  const remainingCount = document.getElementById('remaining-count');
  const animatedDice = document.getElementById('animated-dice');
  const themeToggle = document.getElementById('theme-toggle');
  const taskMinInput = document.getElementById('task-min');
  const taskMaxInput = document.getElementById('task-max');
  const pickedSummary = document.getElementById('picked-summary');

  const rollSound = document.getElementById('roll-sound');
  const winSound = document.getElementById('win-sound');
  const clickSound = document.getElementById('click-sound');

  const students = [
    "Jaya", "Deepika", "Siddhi", "Utkarsh", "Khushi", "Manish",
    "Rohan", "Abha", "Balwan", "Roshni", "Aman", "Varsha",
    "Honey", "Sneha", "Naina", "Shivang", "Parth", "Raghav",
    "Kuldeep", "Aryan", "Harshit", "Kanha", "Uday", "Priyanshi",
    "Krishna"
  ];


  let availableStudents = [...students];
  let studentTasks = {};
  let currentSelectedStudent = null;
  let isRolling = false;
  let darkMode = false;
  let rollInterval;

  function initApp() {
    createStudentCards();
    updateRemainingCount();
    setupEventListeners();
    checkPreferredTheme();
    initParticles();
  }

  function createStudentCards() {
    studentGrid.innerHTML = '';
    students.forEach(student => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.dataset.name = student;
      card.innerHTML = `<div class="student-name">${student}</div>`;
      studentGrid.appendChild(card);
    });
  }

  function updateRemainingCount() {
    remainingCount.textContent = availableStudents.length;
  }

  function updatePickedSummary() {
    pickedSummary.innerHTML = '';
    Object.entries(studentTasks).forEach(([student, tasks]) => {
      const latestTask = tasks[tasks.length - 1]; // get only the last task
      const card = document.createElement('div');
      card.className = 'picked-card';
      card.innerHTML = `
      <h4>${student}</h4>
      <div class="tasks">
        ${latestTask ? `<span class="task-badge">${latestTask}</span>` : ''}
      </div>
    `;
      pickedSummary.appendChild(card);
    });
  }

  function setupEventListeners() {
    pickStudentBtn.addEventListener('click', () => {
      clickSound.play();
      startStudentRoll();
    });
    pickTaskBtn.addEventListener('click', () => {
      clickSound.play();
      startTaskRoll();
    });
    resetBtn.addEventListener('click', () => {
      clickSound.play();
      resetPicker();
    });
    themeToggle.addEventListener('click', toggleTheme);
  }

  function startStudentRoll() {
    if (isRolling || availableStudents.length === 0) return;

    isRolling = true;
    pickStudentBtn.disabled = true;
    animatedDice.classList.add('rolling');
    rollSound.play();
    let rollCount = 0;
    let totalRolls = 30 + Math.floor(Math.random() * 20);

    rollInterval = setInterval(() => {
      let randomItem = availableStudents[Math.floor(Math.random() * availableStudents.length)];
      document.querySelectorAll(`.student-card`).forEach(card => card.classList.remove('selected'));
      document.querySelector(`.student-card[data-name="${randomItem}"]`).classList.add('selected');
      resultDisplay.textContent = randomItem;
      rollCount++;
      if (rollCount >= totalRolls) {
        clearInterval(rollInterval);
        rollSound.pause();
        rollSound.currentTime = 0;
        animatedDice.classList.remove('rolling');
        availableStudents = availableStudents.filter(s => s !== randomItem);
        updateRemainingCount();
        currentSelectedStudent = randomItem;
        document.querySelector(`.student-card[data-name="${randomItem}"]`).classList.add('picked');
        if (!studentTasks[randomItem]) studentTasks[randomItem] = [];
        updatePickedSummary();
        winSound.play();
        isRolling = false;
        pickStudentBtn.disabled = false;
      }
    }, 100);
  }

  function startTaskRoll() {
    if (!currentSelectedStudent) {
      alert("Please select a student first.");
      return;
    }
    if (isRolling) return;
    let minTask = parseInt(taskMinInput.value);
    let maxTask = parseInt(taskMaxInput.value);
    if (isNaN(minTask) || isNaN(maxTask) || minTask > maxTask) {
      alert("Invalid task range.");
      return;
    }
    let tasks = [];
    for (let i = minTask; i <= maxTask; i++) tasks.push(i);

    isRolling = true;
    pickTaskBtn.disabled = true;
    animatedDice.classList.add('rolling');
    rollSound.play();
    let rollCount = 0;
    let totalTaskRolls = 20 + Math.floor(Math.random() * 10);

    rollInterval = setInterval(() => {
      let randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      resultDisplay.textContent = `${currentSelectedStudent} — Task ${randomTask}`;
      rollCount++;
      if (rollCount >= totalTaskRolls) {
        clearInterval(rollInterval);
        animatedDice.classList.remove('rolling');
        winSound.play();
        studentTasks[currentSelectedStudent].push(`Task ${randomTask}`);
        updatePickedSummary();
        isRolling = false;
        pickTaskBtn.disabled = false;
      }
    }, 100);
  }

  function resetPicker() {
    clearInterval(rollInterval);
    isRolling = false;
    pickStudentBtn.disabled = false;
    pickTaskBtn.disabled = false;
    availableStudents = [...students];
    studentTasks = {};
    resultDisplay.textContent = '-';
    currentSelectedStudent = null;
    updateRemainingCount();
    pickedSummary.innerHTML = '';
    document.querySelectorAll('.student-card').forEach(card => card.classList.remove('picked', 'selected'));
  }

  function toggleTheme() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    initParticles();
  }

  function checkPreferredTheme() {
    darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  function initParticles() {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80 },
        color: { value: darkMode ? "#a29bfe" : "#6c5ce7" },
        line_linked: { color: darkMode ? "#a29bfe" : "#6c5ce7" }
      }
    });
  }

  initApp();
});
