document
  .getElementById("createReservationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      nositelj_rezervacije: document.getElementById("nositelj_rezervacije")
        .value,
      broj_osoba: parseInt(document.getElementById("broj_osoba").value),
      vrijeme_pocetka: document.getElementById("vrijeme_pocetka").value,
      trajanje_minute: parseInt(
        document.getElementById("trajanje_minute").value
      ),
      cijena: parseFloat(document.getElementById("cijena").value),
      popust: parseFloat(document.getElementById("popust").value),
      vodic: document.getElementById("vodic").value,
    };

    fetch("http://localhost:5000/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("result").innerText = JSON.stringify(data);
        document.getElementById("createReservationForm").reset();
      });
  });

function displayResult(data) {
  if (Array.isArray(data)) {
    let output = "";
    for (let item of data) {
      output += `ID: ${item.id}, Nositelj rezervacije: ${item.nositelj_rezervacije}<br>`;
    }
    document.getElementById("result").innerHTML = output;
  } else {
    const formattedData = {
      ...data,
      ukupna_cijena: (data.cijena * (100 - data.popust)) / 100,
    };
    document.getElementById("result").innerText = JSON.stringify(
      formattedData,
      null,
      2
    );
  }
}

function readReservation() {
  const id = document.getElementById("reservation_id").value;
  fetch(`http://localhost:5000/reservation/${id}`)
    .then((response) => response.json())
    .then((data) => {
      displayResult(data);
    });
}

function updateReservation() {
  const id = document.getElementById("reservation_id").value;
  const data = {
    nositelj_rezervacije: document.getElementById("nositelj_rezervacije").value,
    broj_osoba: parseInt(document.getElementById("broj_osoba").value),
    vrijeme_pocetka: document.getElementById("vrijeme_pocetka").value,
    trajanje_minute: parseInt(document.getElementById("trajanje_minute").value),
    cijena: parseFloat(document.getElementById("cijena").value),
    popust: parseFloat(document.getElementById("popust").value),
    vodic: document.getElementById("vodic").value,
  };

  fetch(`http://localhost:5000/reservation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      displayResult(data);
    });
}

function deleteReservation() {
  const id = document.getElementById("reservation_id").value;
  fetch(`http://localhost:5000/reservation/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      displayResult(data);
    });
}

function fetchAndDisplayCharts() {
  fetch("http://localhost:5000/reservation/0")
    .then((response) => response.json())
    .then((data) => {
      const vodics = [];
      const reservationsCount = {};
      const totalDuration = {};

      for (let reservation of data) {
        if (!reservationsCount[reservation.vodic]) {
          vodics.push(reservation.vodic);
          reservationsCount[reservation.vodic] = 1;
          totalDuration[reservation.vodic] = reservation.trajanje_minute;
        } else {
          reservationsCount[reservation.vodic] += 1;
          totalDuration[reservation.vodic] += reservation.trajanje_minute;
        }
      }

      const reservationsChartData = Object.values(reservationsCount);
      const durationChartData = Object.values(totalDuration);

      const ctx1 = document
        .getElementById("reservationsChart")
        .getContext("2d");
      new Chart(ctx1, {
        type: "bar",
        data: {
          labels: vodics,
          datasets: [
            {
              label: "Broj rezervacija",
              data: reservationsChartData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      const ctx2 = document.getElementById("durationChart").getContext("2d");
      new Chart(ctx2, {
        type: "bar",
        data: {
          labels: vodics,
          datasets: [
            {
              label: "Ukupno trajanje",
              data: durationChartData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
}

fetchAndDisplayCharts();
