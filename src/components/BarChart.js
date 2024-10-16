// components/BarChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ category }) => {
    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: '',
            borderWidth: 1,
        }],
    });

    const colors = {
        BE: '#ff6384',
        CS: '#36a2eb',
        FE: '#ffcd56'
    };

    useEffect(() => {
        fetch('http://localhost:8080/statistics/question')
            .then(response => response.json())
            .then(data => {
                const categories = {
                    BE: ["Java", "Spring", "NodeJs", "ExpressJs", "Django", "Flask", "Ruby", "PHP", "GraphQL", "MySQL"],
                    CS: ["Networking", "OS", "DataStructure", "Algorithms", "SoftwareEngineering", "DesignPatterns", "ComputerArchitecture", "Cybersecurity", "ArtificialIntelligence"],
                    FE: ["React", "Vue", "Angular", "HTML5", "CSS3", "JavaScriptES6Plus", "TypeScript", "SassScss", "Webpack", "ResponsiveWebDesign"]
                };

                const labels = categories[category];
                const values = labels.map(label => data.data[label.toLowerCase()]);
                console.log(labels,values)

                setBarChartData({
                    labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors[category],
                    }],
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [category]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bar
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Bar data={barChartData} options={options} />
        </div>
    );
};

export default BarChart;
