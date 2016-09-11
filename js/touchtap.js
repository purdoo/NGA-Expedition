
jQuery.noConflict();
(function ($) {
  $(document).ready(function ($) {
    console.log('THIS SHIT IS LOADED');
    // onclick toggles for our different forms
    $('#housing-button').on('click', function(event) {
      //$('#search-form').toggle(true);
      //$('#housing-button').toggle(false);
      $('#housing-button').addClass('active');
      $('#routing-button').removeClass('active');
      $('#metrics-button').removeClass('active');
    });
    $('#routing-button').on('click', function(event) {
      $('#routing-button').addClass('active');
      $('#housing-button').removeClass('active');
      $('#metrics-button').removeClass('active');
    });
    $('#metrics-button').on('click', function(event) {
      $('#routing-button').removeClass('active');
      $('#housing-button').removeClass('active');
      $('#metrics-button').addClass('active');
    });
  });
});
