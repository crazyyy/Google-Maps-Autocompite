// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

let placeSearch;
let autocomplete;
const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'long_name',
  country: 'long_name',
  postal_code: 'short_name',
};

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {HTMLInputElement} */
    (document.getElementById('autocomplete')), { types: ['geocode'] },
  );
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.

  console.log(autocomplete);
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    fillInAddress();
  });

  const autocompleteinput = document.getElementById('autocomplete');
  autocompleteinput.addEventListener('focus', geolocate, true);

  initializeDate();

  PhoneZipVlidation();
}


function initializeDate() {
  const dateMonth = document.getElementById('date-month');
  const dateDay = document.getElementById('date-day');
  const dateYear = document.getElementById('date-year');

  const Today = new Date();

  const minYear = Today.getYear() - 16 + 1900;
  const maxYear = Today.getYear() - 100 + 1900;
  // console.log('min year', minYear);
  // console.log('max year', maxYear);

  for (let i = minYear; i >= maxYear; i--) {
    console.log(i);
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    dateYear.appendChild(opt);
  }

  const aMonth = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  for (let i = 0; i <= 11; i++) {
    const opt = document.createElement('option');
    opt.value = aMonth[i];
    opt.innerHTML = aMonth[i];
    opt.setAttribute('data-number', i + 1);
    dateMonth.appendChild(opt);
  }

  const nDays = 31;

  for (let i = 1; i <= nDays; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    opt.setAttribute('data-number', i);
    dateDay.appendChild(opt);
  }


  dateMonth.addEventListener('change', changeDateMonth, true);
  dateYear.addEventListener('change', changeDateYear, true);
  dateDay.addEventListener('change', changeDateDay, true);
}

function changeDateMonth(event) {
  console.log(event);
  const selectedYear = document.getElementById('date-year').value;
  const selectedMonth = document.getElementById('date-month').value;

  if (selectedYear && selectedMonth) {
    // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-3.php
    const daysInMoth = getDaysInMonth(selectedMonth, selectedYear);

    // set SelectDate max days

    const dateDay = document.getElementById('date-day');
    dateDay.innerHTML = '';
    for (let i = 1; i <= daysInMoth; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = i;
      opt.setAttribute('data-number', i);
      dateDay.appendChild(opt);
    }
  }
}

function changeDateYear(event) {
  console.log(event);
  const selectedYear = document.getElementById('date-year').value;
  const selectedMonth = document.getElementById('date-month').value;

  if (selectedYear && selectedMonth) {
    const daysInMoth = getDaysInMonth(selectedMonth, selectedYear);

    // set SelectDate max days
  }
}

function changeDateDay(event) {
  console.log(event);
}


// country state autocomplite https://leaverou.github.io/awesomplete/
// https://restcountries.eu/rest/v2/all?fields=name;altSpellings;alpha2Code
// https://restcountries.eu/#api-endpoints-name
// https://www.usps.com/business/web-tools-apis/welcome.htm
// https://annexare.github.io/Countries/


function PhoneZipVlidation() {
  document.getElementById('phone').addEventListener('input', (e) => {
    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `${x[1]} ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
  });

  $('#postal_code').change(() => {
    console.log('change ');
    const loan_amt = document.getElementById('zip');
    loan_amt.value = loan_amt.value.replace(/[^0-9]/g, '');
  });
  $('#postal_code').on('keyup', function (e) {
    const $field = $(this);
    let val = this.value.replace(/\D/g, '');
    if (val.length > Number($field.attr('maxlength'))) {
      val = val.slice(0, 5);
      $field.val(val);
    }
    $field.val(val);
  });
}


// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();

  for (const component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (let i = 0; i < place.address_components.length; i++) {
    console.log(place.address_components);
    const addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      const val = place.address_components[i][componentForm[addressType]];
      const element = document.getElementById(addressType);
      element.value = val;

      if ((addressType == 'administrative_area_level_1') || (addressType == 'country')) {
        const valSecond = place.address_components[i].short_name;
        element.setAttribute('data-code', valSecond);
        element.setAttribute('data-name', val);
      }
    }
  }
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude,
      );
      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]


(($) => {
  // When DOM is ready
  $(() => {
    initialize();
  });
})(jQuery);
