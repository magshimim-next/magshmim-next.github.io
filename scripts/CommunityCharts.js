const ctx = document.getElementById('myChart');

// to change the data change it here
// counter = the precentage of the community members
// background = the color of the bar (with alpha channel)
// borderColor = the color of the border (with alpha channel)
const data = [
    { label: ['Technological', 'units services'], count: 40, background: '#748560AA', borderColor: '#a8b393ff' },
    { label: 'Founders', count: 20, background: '#F0C552AA', borderColor: '#FFFFFFA0' },
    { label: ['Developers &', 'Researchers'], count: 15, background: '#7086FDAA', borderColor: '#FFFFFFA0' },
    { label: 'Academics', count: 25, background: '#1B263AAA', borderColor: '#FFFFFFA0' },
];

const graph = new Chart(ctx,
    {
        type: 'bar',
        data: {
            labels: data.map(row => row.label),
            datasets: [
                {
                    label: 'Precentage of community members',
                    data: data.map(row => row.count),
                    backgroundColor: data.map(row => row.background || '#7eccffff'),
                    borderColor: data.map(row => row.borderColor || '#95d6f0d8'),
                    borderWidth: 2,
                    borderRadius: 20,
                }
            ]
        },
        options: {
            animation: {
                duration: 2000, // Animation duration in ms
                easing: 'easeInOutCubic' // Easing function
            },
            scales: {   // 👈 This wrapper was missing
                x: {

                    type: 'category',
                    ticks: {
                        font: {
                            size: 14, // font size in px
                            family: 'Poppins, Arial, sans-serif', // font family
                            weight: 'bold', // optional
                        },
                        autoSkip: false,   // 👈 Don’t skip labels
                        maxRotation: 0,    // 👈 Prevent rotation
                        minRotation: 0,    // 👈 Prevent rotation
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
            , plugins: { legend: false }
        }
    }
);

