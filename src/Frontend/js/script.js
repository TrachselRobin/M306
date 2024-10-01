/*
  VERSION:              Robin Trachsel
  DATE:                 30.09.2024
  DESCRIPTION:          Frontend script
*/

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Beispiel-Daten für das Säulendiagramm
  const data = {
    labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    datasets: [{
      label: 'Umsatz',
      data: [300, 200, 150, 400, 500, 700, 600, 800, 900, 1000, 1200, 1100, 300, 200, 150, 400, 500, 700, 600, 800, 900, 1000, 1200, 1100, 300, 200, 150, 400, 500, 700, 600, 800, 900, 1000, 1200, 1100],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // Diagramm-Optionen mit Zoom und Schwenk-Optionen
  const options = {
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: false,  // Deaktiviere eingebautes Schwenken
          mode: 'x'      // Wir machen das manuell
        },
        zoom: {
          wheel: {
            enabled: true, // Zoom mit Mausrad
            speed: 0.05 // Verlangsamt die Zoom-Geschwindigkeit
          },
          pinch: {
            enabled: true, // Zoom mit Touch-Pinch
            speed: 0.05
          },
          mode: 'x'
        }
      }
    }
  };

  // Initialisierung des Diagramms
  const myChart = new Chart(ctx, {
    type: 'bar', // Säulendiagramm
    data: data,
    options: options
  });

  // Variablen für benutzerdefiniertes Schwenken
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  const canvas = document.getElementById('myChart');

  // Ereignis für Maus-Button-Down (Start des Schwenkens)
  canvas.addEventListener('mousedown', function (event) {
    isDragging = true;
    startX = event.clientX;
    const chartArea = myChart.chartArea;
    scrollStart = myChart.scales.x.min; // Speichere den Anfangswert für die x-Achse
  });

  // Ereignis für Maus-Bewegung während des Ziehens
  canvas.addEventListener('mousemove', function (event) {
    if (isDragging) {
      const deltaX = event.clientX - startX;
      const scaleFactor = (myChart.scales.x.max - myChart.scales.x.min) / myChart.width;

      const newMin = scrollStart - deltaX * scaleFactor;
      const newMax = newMin + (myChart.scales.x.max - myChart.scales.x.min);

      // Begrenze das Schwenken, damit es nicht über die Daten hinausgeht
      if (newMin >= 0 && newMax <= data.labels.length) {
        myChart.options.scales.x.min = newMin;
        myChart.options.scales.x.max = newMax;
        myChart.update();
      }
    }
  });

  // Ereignis für Maus-Button-Up (Ende des Schwenkens)
  canvas.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // Ereignis für Maus-Verlassen (auch Ende des Schwenkens)
  canvas.addEventListener('mouseleave', function () {
    isDragging = false;
  });
});