
const hamburguer = document.querySelector('.hamburguer');
const itemMenu = document.querySelector('#item-menu');
const itemProfile = document.querySelector('#item-profile');
const itemUploadCourse = document.querySelector('#item-upload-course');
const itemMyCourses = document.querySelector('#item-my-courses');

hamburguer.addEventListener('click', function(){
    this.classList.toggle('is-active');
});

itemMenu.addEventListener('click', function(){
    itemProfile.classList.remove('is-active');
    itemUploadCourse.classList.remove('is-active');
    itemMyCourses.classList.remove('is-active');
    this.classList.toggle('is-active');
});

itemProfile.addEventListener('click', function(){
    itemMenu.classList.remove('is-active');
    itemUploadCourse.classList.remove('is-active');
    itemMyCourses.classList.remove('is-active');
    this.classList.toggle('is-active');
});

itemUploadCourse.addEventListener('click', function(){
    if(!itemUploadCourse.classList.contains('not-active')){
        itemMenu.classList.remove('is-active');
        itemProfile.classList.remove('is-active');
        itemMyCourses.classList.remove('is-active');
        this.classList.toggle('is-active');
    }
});

itemMyCourses.addEventListener('click', function(){
    if(!itemMyCourses.classList.contains('not-active')){
        itemMenu.classList.remove('is-active');
        itemUploadCourse.classList.remove('is-active');
        itemProfile.classList.remove('is-active');
        this.classList.toggle('is-active');
    }
});


$(document).ready(function() {
    $(".hamburguer").click(function() {
        $(".menu").slideToggle(400);
    });
});