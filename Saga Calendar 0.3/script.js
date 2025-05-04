// Calendar data and state
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;
let events = {};

// DOM elements
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYearElement = document.getElementById('current-month-year');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const todayBtn = document.querySelector('.today-btn');
const monthItems = document.querySelectorAll('.month-item');
const yearDisplay = document.querySelector('.year-display');
const prevYearBtn = document.querySelector('.prev-year');
const nextYearBtn = document.querySelector('.next-year');
const newEventBtn = document.querySelector('.new-event-btn');
const eventModal = document.getElementById('event-modal');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const viewButtons = document.querySelectorAll('.view-btn');

// Initialize the calendar
function initCalendar() {
    renderCalendar();
    setupEventListeners();
}

// Render the calendar grid
function renderCalendar() {
    // Clear the grid
    calendarGrid.innerHTML = '';
    
    // Update month and year display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthYearElement.textContent = `${monthNames[currentMonth]}, ${currentYear}`;
    yearDisplay.textContent = currentYear;
    
    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get the last day of the previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    // Calculate the number of rows needed
    const rows = Math.ceil((startingDay + totalDays) / 7);
    
    // Create calendar rows
    let date = 1;
    let nextMonthDate = 1;
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'calendar-row';
        
        // Add week number
        const weekNumber = document.createElement('div');
        weekNumber.className = 'week-number';
        
        // Calculate the week number (ISO week)
        const weekDate = new Date(currentYear, currentMonth, date - startingDay + (i * 7));
        const weekNum = getWeekNumber(weekDate);
        weekNumber.innerHTML = `<div>Week</div><div>${weekNum}</div>`;
        row.appendChild(weekNumber);
        
        // Add days to the row
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            if (i === 0 && j < startingDay) {
                // Previous month days
                const prevDate = prevMonthLastDay - startingDay + j + 1;
                cell.innerHTML = `<div class="date-number other-month">${prevDate}</div>`;
                cell.dataset.date = formatDate(new Date(currentYear, currentMonth - 1, prevDate));
            } else if (date > totalDays) {
                // Next month days
                cell.innerHTML = `<div class="date-number other-month">${nextMonthDate}</div>`;
                cell.dataset.date = formatDate(new Date(currentYear, currentMonth + 1, nextMonthDate));
                nextMonthDate++;
            } else {
                // Current month days
                const dateObj = new Date(currentYear, currentMonth, date);
                const isToday = isCurrentDay(dateObj);
                
                cell.innerHTML = `<div class="date-number ${isToday ? 'current-day' : ''}">${date}</div>`;
                cell.dataset.date = formatDate(dateObj);
                
                if (isToday) {
                    cell.classList.add('current-day');
                }
                
                // Add events for this date if any
                const dateStr = formatDate(dateObj);
                if (events[dateStr]) {
                    events[dateStr].forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.textContent = event.title;
                        cell.appendChild(eventDiv);
                    });
                }
                
                date++;
            }
            
            row.appendChild(cell);
        }
        
        calendarGrid.appendChild(row);
    }
}

// Check if a date is the current day
function isCurrentDay(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Get ISO week number
function getWeekNumber(date) {
    const target = new Date(date);
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display
function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Navigate to previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Navigate to next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Navigate to today
function goToToday() {
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    renderCalendar();
}

// Navigate to specific month and year
function goToMonthYear(month, year) {
    currentMonth = month;
    currentYear = year;
    renderCalendar();
}

// Open event modal for a specific date
function openEventModal(dateStr) {
    selectedDate = dateStr;
    eventDateInput.value = formatDateForDisplay(dateStr);
    eventModal.style.display = 'block';
}

// Close event modal
function closeEventModal() {
    eventModal.style.display = 'none';
    eventForm.reset();
    selectedDate = null;
}

// Add a new event
function addEvent(event) {
    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }
    events[selectedDate].push(event);
    renderCalendar();
}

// Set up event listeners
function setupEventListeners() {
    // Previous and next month navigation
    prevBtn.addEventListener('click', prevMonth);
    nextBtn.addEventListener('click', nextMonth);
    
    // Today button
    todayBtn.addEventListener('click', goToToday);
    
    // Month selection
    monthItems.forEach(item => {
        item.addEventListener('click', () => {
            goToMonthYear(parseInt(item.dataset.month), currentYear);
        });
    });
    
    // Year navigation
    prevYearBtn.addEventListener('click', () => {
        currentYear--;
        yearDisplay.textContent = currentYear;
    });
    
    nextYearBtn.addEventListener('click', () => {
        currentYear++;
        yearDisplay.textContent = currentYear;
    });
    
    // Calendar cell click
    calendarGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.calendar-cell');
        if (cell) {
            openEventModal(cell.dataset.date);
        }
    });
    
    // New event button
    newEventBtn.addEventListener('click', () => {
        const today = new Date();
        selectedDate = formatDate(today);
        eventDateInput.value = formatDateForDisplay(selectedDate);
        eventModal.style.display = 'block';
    });
    
    // Close modal
    closeModal.addEventListener('click', closeEventModal);
    cancelBtn.addEventListener('click', closeEventModal);
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeEventModal();
        }
    });
    
    // Event form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        
        addEvent({
            title,
            time,
            description
        });
        
        closeEventModal();
    });
    
    // View buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // In a real app, we would switch views here
        });
    });
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', initCalendar);