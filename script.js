var header = document.querySelector("header");
var tourSelect = document.querySelector('#tour-selection');
var phoneInput = document.querySelector("#phone")
var dateFrom = document.getElementById('date-from');
var dateTo = document.getElementById('date-to');
var form = document.querySelector('.tour-creation__form');
//Фиксированный хэдер
if(header) {
  window.addEventListener('scroll', function () {
      var scrollStartPosition = window.scrollY > 450;
          header.classList.toggle("header--fixed", scrollStartPosition)
  })
}
//Изменение цвета селекта

if (tourSelect) {
    tourSelect.addEventListener('change', function() {
        this.classList.toggle('selected', !!this.value);
    });
    tourSelect.classList.toggle('selected', !!tourSelect.value);
}
//Маска для телефона
var isLibReady = typeof window.IMask !== "undefined";
if (isLibReady){
    var mask = new IMask(phoneInput, {
        mask: "+7(000)000-00-00"
    })
}

//Маска для дат 
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(month, year) {
  return month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
}

function parseDate(dateStr) {
  const [dd, mm, yyyy] = dateStr.split('.').map(Number);
  return { dd, mm, yyyy };
}

function validateDateStr(dateStr) {
  const { dd, mm, yyyy } = parseDate(dateStr);
  if (!dd || !mm || !yyyy) return { valid: false, reason: 'Неверный формат даты' };
  if (dd < 1 || dd > getDaysInMonth(mm, yyyy)) return { valid: false, reason: 'Неверное количество дней в месяце' };

  const inputDate = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) return { valid: false, reason: 'Дата не может быть в прошлом' };
  
  return { valid: true,  date: inputDate };
}

function validateDateRange(dateFrom, dateTo) {
  const from = validateDateStr(dateFrom);
  const to = validateDateStr(dateTo);

  if (!from.valid) return { field: 'from', ...from };
  if (!to.valid) return { field: 'to', ...to };

  if ( from && to && to.date < from.date) return { valid: false, field: 'to', reason: 'Дата окончания раньше даты начала' };
  return { valid: true };
}

function applyDateMask(input) {
  input.addEventListener('input', onInput);
  
  function onInput(e) {
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        return; 
    }

    const prev = input.value;
    const cursor = input.selectionStart;

    let digits = prev.replace(/\D/g, '').slice(0, 8);
    let dd = digits.slice(0, 2);
    let mm = digits.slice(2, 4);
    let yyyy = digits.slice(4, 8);

    
    if (dd.length === 1) {
      if (+dd > 3) dd = '0' + dd;
    } else if (dd.length === 2) {
      let num = +dd;
      if (num === 0) num = 1;
      if (num > 31) num = 31;
      dd = String(num).padStart(2, '0');
    }

    
    if (mm.length === 1) {
      if (+mm > 1) mm = '0' + mm;
    } else if (mm.length === 2) {
      let num = +mm;
      if (num === 0) num = 1;
      if (num > 12) num = 12;
      mm = String(num).padStart(2, '0');
    }

    let formatted = dd;
    if (digits.length >= 2) formatted += '.' + mm;
    if (digits.length >= 4) formatted += '.' + yyyy;

    if (formatted !== prev) {
      const diff = formatted.length - prev.length;
      input.value = formatted;

      let newPos = cursor + diff;
      if (newPos < 0) newPos = 0;
      if (newPos > formatted.length) newPos = formatted.length;
      input.setSelectionRange(newPos, newPos);
    }
  }
}

function validateField(dateInput) {
  const result = validateDateStr(dateInput.value);
  dateInput.setCustomValidity(result.valid ? '' : result.reason);
  dateInput.reportValidity();
}

function validateRange(dateFrom, dateTo) {
  const result = validateDateRange(dateFrom.value, dateTo.value);
  if (!result.valid && result.field === 'to') {
    dateTo.setCustomValidity(result.reason);
  } else {
    dateTo.setCustomValidity('');
  }
  dateTo.reportValidity();
}

applyDateMask(dateFrom);
applyDateMask(dateTo);

dateFrom.addEventListener('blur', function() {
  validateField(dateFrom);

});

dateTo.addEventListener('blur', function() {
  validateField(dateTo);
    validateRange(dateFrom, dateTo);
});

//Отправка формы
form.addEventListener('submit', function(event) {
  event.preventDefault()
  const formData = new FormData(form);
  console.log(Array.from(formData))
  /*fetch('/example-api/submit-form', {
    method: 'POST',
    body: formData
  }) */
  document.querySelector('#tours').scrollIntoView({ behavior: 'smooth' });
  form.reset();

})