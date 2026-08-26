import Lenis from 'lenis'

// Initialize Lenis
const lenis = new Lenis({
    lerp: 0.9,
    duration: 2.3,
    // smooth:true,

    autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
    console.log(e);
});