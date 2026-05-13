// Мы экспортируем одну главную функцию, которая "оживит" блок при вызове
export function initTourCreation() {
  const form = document.querySelector(".tour-creation__form");

  // Важный момент: если формы на этой конкретной странице нет,
  // скрипт просто остановится и не будет выдавать ошибки в консоль.
  if (!form) return;

  // ТВОЙ КОД БЕЗ ИЗМЕНЕНИЙ (только обновили поиск элементов внутри формы для надежности)
  var tourSelect = form.querySelector("#tour-selection");
  var phoneInput = form.querySelector("#phone");
  var dateFrom = form.querySelector("#date-from");
  var dateTo = form.querySelector("#date-to");
  var tourSection = document.querySelector("#tours");

  // --- Изменение цвета селекта ---
  if (tourSelect) {
    tourSelect.addEventListener("change", function () {
      this.classList.toggle("selected", !!this.value);
    });
    tourSelect.classList.toggle("selected", !!tourSelect.value);
  }

  // --- Маска для телефона ---
  var isLibReady = typeof window.IMask !== "undefined";
  if (isLibReady && phoneInput) {
    var mask = new IMask(phoneInput, {
      mask: "+7(000)000-00-00",
    });
  }

  // --- Маска для дат и вспомогательные функции ---
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getDaysInMonth(month, year) {
    return month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
  }

  function parseDate(dateStr) {
    const [dd, mm, yyyy] = dateStr.split(".").map(Number);
    return { dd, mm, yyyy };
  }

  function validateDateStr(dateStr) {
    const { dd, mm, yyyy } = parseDate(dateStr);
    if (!dd || !mm || !yyyy)
      return { valid: false, reason: "Неверный формат даты" };
    if (dd < 1 || dd > getDaysInMonth(mm, yyyy))
      return { valid: false, reason: "Неверное количество дней в месяце" };

    const inputDate = new Date(yyyy, mm - 1, dd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today)
      return { valid: false, reason: "Дата не может быть в прошлом" };

    return { valid: true, date: inputDate };
  }

  function validateDateRange(dateFrom, dateTo) {
    const from = validateDateStr(dateFrom);
    const to = validateDateStr(dateTo);

    if (!from.valid) return { field: "from", ...from };
    if (!to.valid) return { field: "to", ...to };

    if (from && to && to.date < from.date)
      return {
        valid: false,
        field: "to",
        reason: "Дата окончания не может быть раньше даты начала",
      };
    return { valid: true };
  }

  function applyDateMask(input) {
    if (!input) return;
    input.addEventListener("input", onInput);

    function onInput(e) {
      if (
        e.inputType === "deleteContentBackward" ||
        e.inputType === "deleteContentForward"
      )
        return;

      const prev = input.value;
      const cursor = input.selectionStart;
      let digits = prev.replace(/\D/g, "").slice(0, 8);
      let dd = digits.slice(0, 2);
      let mm = digits.slice(2, 4);
      let yyyy = digits.slice(4, 8);

      if (dd.length === 1 && +dd > 3) dd = "0" + dd;
      else if (dd.length === 2) {
        let num = +dd;
        if (num === 0) num = 1;
        if (num > 31) num = 31;
        dd = String(num).padStart(2, "0");
      }

      if (mm.length === 1 && +mm > 1) mm = "0" + mm;
      else if (mm.length === 2) {
        let num = +mm;
        if (num === 0) num = 1;
        if (num > 12) num = 12;
        mm = String(num).padStart(2, "0");
      }

      let formatted = dd;
      if (digits.length >= 2) formatted += "." + mm;
      if (digits.length >= 4) formatted += "." + yyyy;

      if (formatted !== prev) {
        const diff = formatted.length - prev.length;
        input.value = formatted;
        let newPos = Math.max(0, Math.min(cursor + diff, formatted.length));
        input.setSelectionRange(newPos, newPos);
      }
    }
  }

  function validateField(dateInput) {
    if (!dateInput) return;
    const result = validateDateStr(dateInput.value);
    dateInput.setCustomValidity(result.valid ? "" : result.reason);
  }

  function validateRange(dateFrom, dateTo) {
    if (!dateFrom || !dateTo) return;
    const result = validateDateRange(dateFrom.value, dateTo.value);
    dateTo.setCustomValidity(
      !result.valid && result.field === "to" ? result.reason : "",
    );
  }

  // Применяем маски и слушатели
  applyDateMask(dateFrom);
  applyDateMask(dateTo);

  if (dateFrom) {
    dateFrom.addEventListener("input", function () {
      validateField(dateFrom);
      validateRange(dateFrom, dateTo);
    });
  }

  if (dateTo) {
    dateTo.addEventListener("input", function () {
      validateField(dateTo);
      validateRange(dateFrom, dateTo);
    });
  }

  // --- Отправка формы ---
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    validateField(dateFrom);
    validateField(dateTo);
    validateRange(dateFrom, dateTo);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    console.log(Array.from(formData));

    if (tourSection) {
      tourSection.scrollIntoView({ behavior: "smooth" });
    }
    form.reset();
    if (tourSelect) tourSelect.classList.remove("selected");
  });
}
