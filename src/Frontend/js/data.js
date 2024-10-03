document.addEventListener('DOMContentLoaded', async function () {
    const verbrauch1 = document.getElementById('verbrauch1');
    const verbrauch2 = document.getElementById('verbrauch2');
    const einspeisung1 = document.getElementById('einspeisung1');
    const einspeisung2 = document.getElementById('einspeisung2');

    verbrauch1.innerText = await getVerbrauch1();
    verbrauch2.innerText = await getVerbrauch2();
    einspeisung1.innerText = await getEinspeisung1();
    einspeisung2.innerText = await getEinspeisung2();
});

async function getVerbrauch1() {
    const response = await fetch('http://127.0.0.1:3000/esl');
    const data = await response.json();
    
    const verbrauch1 = data.find(d => d.code === '1-1:1.8.1');
    return verbrauch1.value;
}

async function getVerbrauch2() {
    const response = await fetch('http://127.0.0.1:3000/esl');
    const data = await response.json();

    const verbrauch2 = data.find(d => d.code === '1-1:1.8.2');
    return verbrauch2.value;
}

async function getEinspeisung1() {
    const response = await fetch('http://127.0.0.1:3000/esl');
    const data = await response.json();

    const einspeisung1 = data.find(d => d.code === '1-1:2.8.1');
    return einspeisung1.value;
}

async function getEinspeisung2() {
    const response = await fetch('http://127.0.0.1:3000/esl');
    const data = await response.json();

    const einspeisung2 = data.find(d => d.code === '1-1:2.8.2');
    return einspeisung2.value;
}

/*
/sdat:
[
    {
        "sdat": {
            "ID": 6586,
            "IntervalStartTime": "2019-03-11T22:00:00.000Z",
            "IntervalEndTime": "2019-03-12T22:00:00.000Z",
            "DocumentID": "eslevu121963_BR2294_ID742",
            "VersionID": "2007B"
        },
        "intervals": [
            {
                "ID": 1,
                "sdat_ID": 6586,
                "sequenceNr": 1,
                "volume": "3.0000"
            },
            {
                "ID": 2,
                "sdat_ID": 6586,
                "sequenceNr": 2,
                "volume": "2.7000"
            },
            {
                "ID": 3,
                "sdat_ID": 6586,
                "sequenceNr": 3,
                "volume": "3.0000"
            },
            {
                "ID": 4,
                "sdat_ID": 6586,
                "sequenceNr": 4,
                "volume": "1.8000"
            },
            {
                "ID": 5,
                "sdat_ID": 6586,
                "sequenceNr": 5,
                "volume": "0.9000"
            },
            {
                "ID": 6,
                "sdat_ID": 6586,
                "sequenceNr": 6,
                "volume": "0.6000"
            },
            {
                "ID": 7,
                "sdat_ID": 6586,
                "sequenceNr": 7,
                "volume": "0.9000"
            },
            {
                "ID": 8,
                "sdat_ID": 6586,
                "sequenceNr": 8,
                "volume": "0.6000"
            },
            {
                "ID": 9,
                "sdat_ID": 6586,
                "sequenceNr": 9,
                "volume": "0.6000"
            },
            {
                "ID": 10,
                "sdat_ID": 6586,
                "sequenceNr": 10,
                "volume": "0.6000"
            },
            {
                "ID": 11,
                "sdat_ID": 6586,
                "sequenceNr": 11,
                "volume": "0.9000"
            },
            {
                "ID": 12,
                "sdat_ID": 6586,
                "sequenceNr": 12,
                "volume": "0.6000"
            },
            {
                "ID": 13,
                "sdat_ID": 6586,
                "sequenceNr": 13,
                "volume": "0.6000"
            },
            {
                "ID": 14,
                "sdat_ID": 6586,
                "sequenceNr": 14,
                "volume": "0.9000"
            },
            {
                "ID": 15,
                "sdat_ID": 6586,
                "sequenceNr": 15,
                "volume": "0.6000"
            },
            {
                "ID": 16,
                "sdat_ID": 6586,
                "sequenceNr": 16,
                "volume": "0.6000"
            },
            {
                "ID": 17,
                "sdat_ID": 6586,
                "sequenceNr": 17,
                "volume": "0.9000"
            },
            {
                "ID": 18,
                "sdat_ID": 6586,
                "sequenceNr": 18,
                "volume": "0.6000"
            },
            {
                "ID": 19,
                "sdat_ID": 6586,
                "sequenceNr": 19,
                "volume": "0.6000"
            },
            {
                "ID": 20,
                "sdat_ID": 6586,
                "sequenceNr": 20,
                "volume": "0.9000"
            },
            {
                "ID": 21,
                "sdat_ID": 6586,
                "sequenceNr": 21,
                "volume": "0.6000"
            },
            {
                "ID": 22,
                "sdat_ID": 6586,
                "sequenceNr": 22,
                "volume": "0.6000"
            },
            {
                "ID": 23,
                "sdat_ID": 6586,
                "sequenceNr": 23,
                "volume": "0.6000"
            },
            {
                "ID": 24,
                "sdat_ID": 6586,
                "sequenceNr": 24,
                "volume": "0.9000"
            },
            {
                "ID": 25,
                "sdat_ID": 6586,
                "sequenceNr": 25,
                "volume": "1.2000"
            },
            {
                "ID": 26,
                "sdat_ID": 6586,
                "sequenceNr": 26,
                "volume": "1.5000"
            },
            {
                "ID": 27,
                "sdat_ID": 6586,
                "sequenceNr": 27,
                "volume": "1.5000"
            },
            {
                "ID": 28,
                "sdat_ID": 6586,
                "sequenceNr": 28,
                "volume": "2.7000"
            },
            {
                "ID": 29,
                "sdat_ID": 6586,
                "sequenceNr": 29,
                "volume": "3.0000"
            },
            {
                "ID": 30,
                "sdat_ID": 6586,
                "sequenceNr": 30,
                "volume": "4.5000"
            },
            {
                "ID": 31,
                "sdat_ID": 6586,
                "sequenceNr": 31,
                "volume": "4.2000"
            },
            {
                "ID": 32,
                "sdat_ID": 6586,
                "sequenceNr": 32,
                "volume": "4.5000"
            },
            {
                "ID": 33,
                "sdat_ID": 6586,
                "sequenceNr": 33,
                "volume": "4.8000"
            },
            {
                "ID": 34,
                "sdat_ID": 6586,
                "sequenceNr": 34,
                "volume": "5.4000"
            },
            {
                "ID": 35,
                "sdat_ID": 6586,
                "sequenceNr": 35,
                "volume": "4.5000"
            },
            {
                "ID": 36,
                "sdat_ID": 6586,
                "sequenceNr": 36,
                "volume": "4.2000"
            },
            {
                "ID": 37,
                "sdat_ID": 6586,
                "sequenceNr": 37,
                "volume": "3.9000"
            },
            {
                "ID": 38,
                "sdat_ID": 6586,
                "sequenceNr": 38,
                "volume": "3.9000"
            },
            {
                "ID": 39,
                "sdat_ID": 6586,
                "sequenceNr": 39,
                "volume": "4.5000"
            },
            {
                "ID": 40,
                "sdat_ID": 6586,
                "sequenceNr": 40,
                "volume": "4.2000"
            },
            {
                "ID": 41,
                "sdat_ID": 6586,
                "sequenceNr": 41,
                "volume": "4.8000"
            },
            {
                "ID": 42,
                "sdat_ID": 6586,
                "sequenceNr": 42,
                "volume": "5.1000"
            },
            {
                "ID": 43,
                "sdat_ID": 6586,
                "sequenceNr": 43,
                "volume": "4.2000"
            },
            {
                "ID": 44,
                "sdat_ID": 6586,
                "sequenceNr": 44,
                "volume": "4.2000"
            },
            {
                "ID": 45,
                "sdat_ID": 6586,
                "sequenceNr": 45,
                "volume": "4.2000"
            },
            {
                "ID": 46,
                "sdat_ID": 6586,
                "sequenceNr": 46,
                "volume": "2.1000"
            },
            {
                "ID": 47,
                "sdat_ID": 6586,
                "sequenceNr": 47,
                "volume": "0.6000"
            },
            {
                "ID": 48,
                "sdat_ID": 6586,
                "sequenceNr": 48,
                "volume": "0.3000"
            },
            {
                "ID": 49,
                "sdat_ID": 6586,
                "sequenceNr": 49,
                "volume": "0.0000"
            },
            {
                "ID": 50,
                "sdat_ID": 6586,
                "sequenceNr": 50,
                "volume": "0.0000"
            },
            {
                "ID": 51,
                "sdat_ID": 6586,
                "sequenceNr": 51,
                "volume": "0.3000"
            },
            {
                "ID": 52,
                "sdat_ID": 6586,
                "sequenceNr": 52,
                "volume": "0.3000"
            },
            {
                "ID": 53,
                "sdat_ID": 6586,
                "sequenceNr": 53,
                "volume": "0.0000"
            },
            {
                "ID": 54,
                "sdat_ID": 6586,
                "sequenceNr": 54,
                "volume": "0.0000"
            },
            {
                "ID": 55,
                "sdat_ID": 6586,
                "sequenceNr": 55,
                "volume": "0.3000"
            },
            {
                "ID": 56,
                "sdat_ID": 6586,
                "sequenceNr": 56,
                "volume": "0.3000"
            },
            {
                "ID": 57,
                "sdat_ID": 6586,
                "sequenceNr": 57,
                "volume": "0.3000"
            },
            {
                "ID": 58,
                "sdat_ID": 6586,
                "sequenceNr": 58,
                "volume": "0.3000"
            },
            {
                "ID": 59,
                "sdat_ID": 6586,
                "sequenceNr": 59,
                "volume": "0.6000"
            },
            {
                "ID": 60,
                "sdat_ID": 6586,
                "sequenceNr": 60,
                "volume": "1.5000"
            },
            {
                "ID": 61,
                "sdat_ID": 6586,
                "sequenceNr": 61,
                "volume": "0.0000"
            },
            {
                "ID": 62,
                "sdat_ID": 6586,
                "sequenceNr": 62,
                "volume": "2.1000"
            },
            {
                "ID": 63,
                "sdat_ID": 6586,
                "sequenceNr": 63,
                "volume": "0.9000"
            },
            {
                "ID": 64,
                "sdat_ID": 6586,
                "sequenceNr": 64,
                "volume": "0.3000"
            },
            {
                "ID": 65,
                "sdat_ID": 6586,
                "sequenceNr": 65,
                "volume": "0.9000"
            },
            {
                "ID": 66,
                "sdat_ID": 6586,
                "sequenceNr": 66,
                "volume": "0.6000"
            },
            {
                "ID": 67,
                "sdat_ID": 6586,
                "sequenceNr": 67,
                "volume": "0.6000"
            },
            {
                "ID": 68,
                "sdat_ID": 6586,
                "sequenceNr": 68,
                "volume": "0.9000"
            },
            {
                "ID": 69,
                "sdat_ID": 6586,
                "sequenceNr": 69,
                "volume": "0.6000"
            },
            {
                "ID": 70,
                "sdat_ID": 6586,
                "sequenceNr": 70,
                "volume": "0.6000"
            },
            {
                "ID": 71,
                "sdat_ID": 6586,
                "sequenceNr": 71,
                "volume": "0.6000"
            },
            {
                "ID": 72,
                "sdat_ID": 6586,
                "sequenceNr": 72,
                "volume": "0.9000"
            },
            {
                "ID": 73,
                "sdat_ID": 6586,
                "sequenceNr": 73,
                "volume": "1.2000"
            },
            {
                "ID": 74,
                "sdat_ID": 6586,
                "sequenceNr": 74,
                "volume": "1.2000"
            },
            {
                "ID": 75,
                "sdat_ID": 6586,
                "sequenceNr": 75,
                "volume": "2.4000"
            },
            {
                "ID": 76,
                "sdat_ID": 6586,
                "sequenceNr": 76,
                "volume": "2.1000"
            },
            {
                "ID": 77,
                "sdat_ID": 6586,
                "sequenceNr": 77,
                "volume": "3.0000"
            },
            {
                "ID": 78,
                "sdat_ID": 6586,
                "sequenceNr": 78,
                "volume": "2.7000"
            },
            {
                "ID": 79,
                "sdat_ID": 6586,
                "sequenceNr": 79,
                "volume": "1.2000"
            },
            {
                "ID": 80,
                "sdat_ID": 6586,
                "sequenceNr": 80,
                "volume": "0.9000"
            },
            {
                "ID": 81,
                "sdat_ID": 6586,
                "sequenceNr": 81,
                "volume": "0.9000"
            },
            {
                "ID": 82,
                "sdat_ID": 6586,
                "sequenceNr": 82,
                "volume": "0.6000"
            },
            {
                "ID": 83,
                "sdat_ID": 6586,
                "sequenceNr": 83,
                "volume": "0.9000"
            },
            {
                "ID": 84,
                "sdat_ID": 6586,
                "sequenceNr": 84,
                "volume": "0.6000"
            },
            {
                "ID": 85,
                "sdat_ID": 6586,
                "sequenceNr": 85,
                "volume": "1.2000"
            },
            {
                "ID": 86,
                "sdat_ID": 6586,
                "sequenceNr": 86,
                "volume": "0.6000"
            },
            {
                "ID": 87,
                "sdat_ID": 6586,
                "sequenceNr": 87,
                "volume": "0.9000"
            },
            {
                "ID": 88,
                "sdat_ID": 6586,
                "sequenceNr": 88,
                "volume": "0.9000"
            },
            {
                "ID": 89,
                "sdat_ID": 6586,
                "sequenceNr": 89,
                "volume": "1.8000"
            },
            {
                "ID": 90,
                "sdat_ID": 6586,
                "sequenceNr": 90,
                "volume": "1.2000"
            },
            {
                "ID": 91,
                "sdat_ID": 6586,
                "sequenceNr": 91,
                "volume": "2.7000"
            },
            {
                "ID": 92,
                "sdat_ID": 6586,
                "sequenceNr": 92,
                "volume": "2.4000"
            },
            {
                "ID": 93,
                "sdat_ID": 6586,
                "sequenceNr": 93,
                "volume": "2.7000"
            },
            {
                "ID": 94,
                "sdat_ID": 6586,
                "sequenceNr": 94,
                "volume": "2.7000"
            },
            {
                "ID": 95,
                "sdat_ID": 6586,
                "sequenceNr": 95,
                "volume": "2.1000"
            },
            {
                "ID": 96,
                "sdat_ID": 6586,
                "sequenceNr": 96,
                "volume": "0.6000"
            }
        ]
    },
    {
        "sdat": {
            "ID": 6587,
            "IntervalStartTime": "2019-03-11T22:00:00.000Z",
            "IntervalEndTime": "2019-03-12T22:00:00.000Z",
            "DocumentID": "eslevu121964_BR2294_ID735",
            "VersionID": "2007B"
        },
        "intervals": [
            {
                "ID": 97,
                "sdat_ID": 6587,
                "sequenceNr": 1,
                "volume": "0.0000"
            },
            {
                "ID": 98,
                "sdat_ID": 6587,
                "sequenceNr": 2,
                "volume": "0.0000"
            },
            {
                "ID": 99,
                "sdat_ID": 6587,
                "sequenceNr": 3,
                "volume": "0.0000"
            },
            {
                "ID": 100,
                "sdat_ID": 6587,
                "sequenceNr": 4,
                "volume": "0.0000"
            },
            {
                "ID": 101,
                "sdat_ID": 6587,
                "sequenceNr": 5,
                "volume": "0.0000"
            },
            {
                "ID": 102,
                "sdat_ID": 6587,
                "sequenceNr": 6,
                "volume": "0.0000"
            },
            {
                "ID": 103,
                "sdat_ID": 6587,
                "sequenceNr": 7,
                "volume": "0.0000"
            },
            ...
*/