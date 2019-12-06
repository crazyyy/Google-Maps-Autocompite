let placeSearch;
let autocomplete;
const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name',
};

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  let autocomplete = document.getElementById('autocomplete');


  autocomplete = new google.maps.places.Autocomplete(
    /** @type {HTMLInputElement} */
    (document.getElementById('autocomplete')), { types: ['geocode'] },
  );
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    fillInAddress();
  });
}

// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  // const autocomplete = document.getElementById('autocomplete')
  const place = autocomplete.getPlace();

  const container = document.getElementById('container');
  const componentForm = createFormTemplate('form1');
  container.appendChild(componentForm);
  // for (const component in componentForm) {
  //   document.getElementById(component).value = '';
  //   document.getElementById(component).disabled = false;
  // }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (let i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0];
    console.log(addressType);
    if (componentForm[addressType]) {
      const val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
// [END region_fillform]


function createFormTemplate(ID) {
  const formContainer = document.createElement('div');
  const markup = `
    <form class="form-address" id="${ID}">

        <!-- Street Address -->
        <div class="flex-container">
          <label>Street address</label>
          <div class="flex-item c-2column"><input class="street_number" data-cip-id="street_number">
          </div>
          <div class="flex-item c-2column"><input class="route" data-cip-id="route">
          </div>
        </div>

        <!-- City -->
        <div class="flex-container">
          <label>City</label>
          <input class="flex-item c-1column locality" data-cip-id="locality">
        </div>

        <!-- State & Zip -->
        <div class="flex-container">
          <div class="flex-item c-2column">
            <label>State</label>
            <input class="administrative_area_level_1" data-cip-id="administrative_area_level_1">
          </div>
          <div class="flex-item c-2column">
            <label>Zip code</label>
            <input class="postal_code" data-cip-id="postal_code">
          </div>
        </div>

        <!-- Country -->
        <div class="flex-container">
          <label>Country</label>
          <input class="flex-item c-1column country" data-cip-id="country">
        </div>

      </form>
  `;
  formContainer.innerHTML = markup;
  return formContainer;
}


// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
