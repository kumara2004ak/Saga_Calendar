document.addEventListener('DOMContentLoaded', function() {
    // Current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Calendar state
    let selectedDate = new Date(currentYear, currentMonth, currentDay);
    let displayedMonth = currentMonth;
    let displayedYear = currentYear;
    
    // DOM elements
    const calendarBody = document.getElementById('calendarBody');
    const miniDays = document.getElementById('miniDays');
    const monthYearDisplay = document.querySelector('.month-year');
    const miniMonthDisplay = document.querySelector('.mini-month');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const miniPrevButton = document.querySelector('.mini-prev');
    const miniNextButton = document.querySelector('.mini-next');
    const todayButton = document.querySelector('.today-btn');
    const newEventBtn = document.getElementById('newEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeEventModal = document.getElementById('closeEventModal');
    const meetNowBtn = document.querySelector('.meet-now-btn');
    const meetNowModal = document.getElementById('meetNowModal');
    const closeMeetNowModal = document.getElementById('closeMeetNowModal');
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettingsPanel = document.getElementById('closeSettingsPanel');
    
    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Sample events data
    const events = [
        { date: new Date(2025, 2, 3), title: 'One-on-one with Alex', color: 'orange', time: '10:30 AM' },
        { date: new Date(2025, 2, 3), title: 'All-hands meeting', color: 'orange', time: '4:00 PM' },
        { date: new Date(2025, 2, 3), title: 'Dinner with Client', color: 'green', time: '6:30 PM' },
        { date: new Date(2025, 2, 4), title: 'Product planning', color: 'blue', time: '9:30 AM' },
        { date: new Date(2025, 2, 11), title: 'Coffee with Alice', color: 'green', time: '11:00 AM' },
        { date: new Date(2025, 2, 14), title: 'Product planning', color: 'blue', time: '9:30 AM' },
        { date: new Date(2025, 2, 14), title: 'One-on-one with Alex', color: 'orange', time: '10:30 AM' },
        { date: new Date(2025, 2, 14), title: 'All-hands meeting', color: 'orange', time: '4:00 PM' },
        { date: new Date(2025, 2, 14), title: 'Dinner with Client', color: 'green', time: '6:30 PM' },
        { date: new Date(2025, 2, 27), title: 'Coffee with Alice', color: 'green', time: '11:00 AM' },
        { date: new Date(2025, 2, 27), title: 'Marketing strategy', color: 'orange', time: '2:30 PM' },
        { date: new Date(2025, 2, 30), title: 'Product planning', color: 'blue', time: '9:30 AM' }
    ];
    
    // Initialize calendar
    function initCalendar() {
        updateMonthYearDisplay();
        renderCalendar();
        renderMiniCalendar();
        setupEventListeners();
    }
    
    // Update month and year display
    function updateMonthYearDisplay() {
        monthYearDisplay.textContent = `${monthNames[displayedMonth]}, ${displayedYear}`;
        miniMonthDisplay.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;
    }
    
    // Render main calendar
    function renderCalendar() {
        calendarBody.innerHTML = '';
        
        const firstDay = new Date(displayedYear, displayedMonth, 1);
        const lastDay = new Date(displayedYear, displayedMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        
        // Calculate previous month's days to display
        const prevMonthLastDay = new Date(displayedYear, displayedMonth, 0).getDate();
        
        // Calculate number of weeks to display (always 6 rows for consistency)
        const totalDays = 42; // 6 weeks * 7 days
        
        // Create week rows
        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('div');
            weekRow.className = 'calendar-row';
            
            // Add week number
            const weekNumber = document.createElement('div');
            weekNumber.className = 'week-number';
            
            // Calculate week number (ISO week)
            const weekDate = new Date(displayedYear, displayedMonth, (week * 7 + 1) - startDayOfWeek);
            const weekNum = getWeekNumber(weekDate);
            weekNumber.textContent = `Week ${weekNum < 10 ? '0' + weekNum : weekNum}`;
            
            weekRow.appendChild(weekNumber);
            
            // Add days
            for (let day = 0; day < 7; day++) {
                const dayIndex = week * 7 + day;
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-cell';
                
                const dayNumber = document.createElement('div');
                
                // Calculate the date to display
                let displayDate;
                let isOtherMonth = false;
                
                if (dayIndex < startDayOfWeek) {
                    // Previous month
                    const prevMonthDay = prevMonthLastDay - startDayOfWeek + dayIndex + 1;
                    displayDate = new Date(displayedYear, displayedMonth - 1, prevMonthDay);
                    isOtherMonth = true;
                } else if (dayIndex >= startDayOfWeek && dayIndex < startDayOfWeek + daysInMonth) {
                    // Current month
                    const currentMonthDay = dayIndex - startDayOfWeek + 1;
                    displayDate = new Date(displayedYear, displayedMonth, currentMonthDay);
                } else {
                    // Next month
                    const nextMonthDay = dayIndex - startDayOfWeek - daysInMonth + 1;
                    displayDate = new Date(displayedYear, displayedMonth + 1, nextMonthDay);
                    isOtherMonth = true;
                }
                
                // Format day number
                dayNumber.textContent = displayDate.getDate();
                dayNumber.className = 'date-number';
                
                if (isOtherMonth) {
                    dayNumber.classList.add('other-month');
                }
                
                // Highlight today
                if (
                    displayDate.getDate() === currentDay &&
                    displayDate.getMonth() === currentMonth &&
                    displayDate.getFullYear() === currentYear
                ) {
                    dayNumber.classList.add('today');
                }
                
                dayCell.appendChild(dayNumber);
                
                // Add events for this day
                const dayEvents = events.filter(event => 
                    event.date.getDate() === displayDate.getDate() &&
                    event.date.getMonth() === displayDate.getMonth() &&
                    event.date.getFullYear() === displayDate.getFullYear()
                );
                
                dayEvents.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = `event ${event.color}`;
                    eventElement.innerHTML = `${event.title} <span style="float:right;font-size:10px;">${event.time}</span>`;
                    dayCell.appendChild(eventElement);
                });
                
                // Add click event to open event modal
                dayCell.addEventListener('click', () => {
                    selectedDate = new Date(displayDate);
                    openEventModal();
                });
                
                weekRow.appendChild(dayCell);
            }
            
            calendarBody.appendChild(weekRow);
        }
    }
    
    // Render mini calendar
    function renderMiniCalendar() {
        miniDays.innerHTML = '';
        
        const firstDay = new Date(displayedYear, displayedMonth, 1);
        const lastDay = new Date(displayedYear, displayedMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        
        // Calculate previous month's days to display
        const prevMonthLastDay = new Date(displayedYear, displayedMonth, 0).getDate();
        
        // Calculate total days to display (always 6 weeks)
        const totalDays = 42; // 6 weeks * 7 days
        
        for (let i = 0; i < totalDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'mini-day';
            
            // Calculate the date to display
            let displayDate;
            let isOtherMonth = false;
            
            if (i < startDayOfWeek) {
                // Previous month
                const prevMonthDay = prevMonthLastDay - startDayOfWeek + i + 1;
                displayDate = new Date(displayedYear, displayedMonth - 1, prevMonthDay);
                isOtherMonth = true;
            } else if (i >= startDayOfWeek && i < startDayOfWeek + daysInMonth) {
                // Current month
                const currentMonthDay = i - startDayOfWeek + 1;
                displayDate = new Date(displayedYear, displayedMonth, currentMonthDay);
            } else {
                // Next month
                const nextMonthDay = i - startDayOfWeek - daysInMonth + 1;
                displayDate = new Date(displayedYear, displayedMonth + 1, nextMonthDay);
                isOtherMonth = true;
            }
            
            // Format day number
            dayElement.textContent = displayDate.getDate();
            
            if (isOtherMonth) {
                dayElement.classList.add('other-month');
            }
            
            // Highlight today
            if (
                displayDate.getDate() === currentDay &&
                displayDate.getMonth() === currentMonth &&
                displayDate.getFullYear() === currentYear
            ) {
                dayElement.classList.add('today');
            }
            
            // Highlight selected date
            if (
                displayDate.getDate() === selectedDate.getDate() &&
                displayDate.getMonth() === selectedDate.getMonth() &&
                displayDate.getFullYear() === selectedDate.getFullYear()
            ) {
                dayElement.classList.add('selected');
            }
            
            // Add click event
            dayElement.addEventListener('click', () => {
                selectedDate = new Date(displayDate);
                
                // Update mini calendar
                document.querySelectorAll('.mini-day').forEach(day => {
                    day.classList.remove('selected');
                });
                dayElement.classList.add('selected');
                
                // If clicked on a day from another month, navigate to that month
                if (isOtherMonth) {
                    displayedMonth = displayDate.getMonth();
                    displayedYear = displayDate.getFullYear();
                    updateMonthYearDisplay();
                    renderCalendar();
                    renderMiniCalendar();
                }
                
                // Open event modal
                openEventModal();
            });
            
            miniDays.appendChild(dayElement);
        }
    }
    
    // Get ISO week number
    function getWeekNumber(date) {
        const target = new Date(date);
        const dayNumber = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNumber + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    }
    
    // Navigate to previous month
    function prevMonth() {
        displayedMonth--;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }
        updateMonthYearDisplay();
        renderCalendar();
        renderMiniCalendar();
    }
    
    // Navigate to next month
    function nextMonth() {
        displayedMonth++;
        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }
        updateMonthYearDisplay();
        renderCalendar();
        renderMiniCalendar();
    }
    
    // Navigate to today
    function goToToday() {
        displayedMonth = currentMonth;
        displayedYear = currentYear;
        selectedDate = new Date(currentYear, currentMonth, currentDay);
        updateMonthYearDisplay();
        renderCalendar();
        renderMiniCalendar();
    }
    
    // Open event modal
    function openEventModal() {
        eventModal.classList.add('show');
    }
    
    // Close event modal
    function closeModal() {
        eventModal.classList.remove('show');
        meetNowModal.classList.remove('show');
    }
    
    // Open meet now modal
    function openMeetNowModal() {
        meetNowModal.classList.add('show');
    }
    
    // Toggle settings panel
    function toggleSettingsPanel() {
        settingsPanel.classList.toggle('show');
    }
    
    // Setup event listeners
    function setupEventListeners() {
        prevButton.addEventListener('click', prevMonth);
        nextButton.addEventListener('click', nextMonth);
        miniPrevButton.addEventListener('click', prevMonth);
        miniNextButton.addEventListener('click', nextMonth);
        todayButton.addEventListener('click', goToToday);
        
        newEventBtn.addEventListener('click', openEventModal);
        closeEventModal.addEventListener('click', closeModal);
        
        meetNowBtn.addEventListener('click', openMeetNowModal);
        closeMeetNowModal.addEventListener('click', closeModal);
        
        settingsBtn.addEventListener('click', toggleSettingsPanel);
        closeSettingsPanel.addEventListener('click', () => {
            settingsPanel.classList.remove('show');
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                closeModal();
            }
            if (e.target === meetNowModal) {
                closeModal();
            }
        });
        
        // View toggle buttons
        document.querySelectorAll('.view-toggle').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.view-toggle').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
        });
    }
    
    // Initialize calendar
    initCalendar();
});

// Prevent scrollbars
document.body.style.overflow = 'hidden';