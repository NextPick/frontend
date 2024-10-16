// components/Chart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import BarChart from './BarChart';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ onSelectCategory }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 1,
        }],
    });

    const colors = {
        BE: '#ff6384', // Bright Red for BE
        CS: '#36a2eb', // Bright Blue for CS
        FE: '#ffcd56'  // Bright Yellow for FE
    };

    useEffect(() => {
        fetch('http://localhost:8080/statistics/question')
            .then(response => response.json())
            .then(data => {
                const beCategories = ["java", "spring", "nodeJs", "expressJs", "django", "flask", "ruby", "php", "graphQL", "mySQL"];
                const csCategories = ["networking", "os", "dataStructure", "algorithms", "softwareEngineering", "designPatterns", "computerArchitecture", "cybersecurity", "artificialIntelligence"];
                const feCategories = ["react", "vue", "angular", "html5", "css3", "javaScriptES6Plus", "typeScript", "sassScss", "webpack", "responsiveWebDesign"];

                const beTotal = beCategories.reduce((sum, key) => sum + data.data[key], 0);
                const csTotal = csCategories.reduce((sum, key) => sum + data.data[key], 0);
                const feTotal = feCategories.reduce((sum, key) => sum + data.data[key], 0);

                setChartData({
                    labels: ['BE', 'CS', 'FE'],
                    datasets: [{
                        data: [beTotal, csTotal, feTotal],
                        backgroundColor: [colors.BE, colors.CS, colors.FE],
                    }],
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handlePieClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedLabel = chartData.labels[index];
            onSelectCategory(selectedLabel);
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: handlePieClick,
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default Chart;
