async function loadJsonFile(filePath) {
    try {
        const response = await fetch(filePath); // Fetch the JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json(); // Parse the JSON data
        return jsonData; // Return the JavaScript object
    } catch (error) {
        console.error("Error loading JSON file:", error);
        return null; // Handle the error appropriately
    }
}

// Example usage:
const jsonFilePath = 'scripts/statistics.json'; // Replace with the actual path to your JSON file

loadJsonFile(jsonFilePath)
    .then(data => {
        if (data) {
            LoadCharts(data);
            // You can now work with the 'data' object
        } else {
            console.log("Failed to load JSON data.");
        }
    });


async function LoadCharts(statistics) 
{
    const ctx = document.getElementById('myChart');

    // to change the data change it here
    // counter = the precentage of the community members
    // background = the color of the bar (with alpha channel)
    // borderColor = the color of the border (with alpha channel)
    const data = statistics["data"];
    console.log("Statistics:", data);

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
}
