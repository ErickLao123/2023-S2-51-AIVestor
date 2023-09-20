import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { StatusBar } from 'react-native';
import StockCard from './StockCard';
import { useDarkMode } from "./DarkModeContext"; // Import the hook


const PortFolio = () => {
    const { isDarkMode } = useDarkMode(); // Use the hook to access dark mode state

    // Apply dark mode styles conditionally
    const containerStyle = [
        styles.container,
        isDarkMode && styles.darkModeContainaer,
    ];
    const earnedMoneyStyle = isDarkMode ? styles.darkModeEarnedMoney : styles.earnedMoney;
    const losesMoneyStyle = isDarkMode ? styles.darkModeLosesMoney : styles.losesMoney;
    const pieData = [
        {
            name: 'Apple',
            price: Math.floor(Math.random() * 10000) + 1,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Tesla',
            price: Math.floor(Math.random() * 10000) + 1,
            color: 'orange',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Alphabet',
            price: Math.floor(Math.random() * 10000) + 1,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Microsoft',
            price: Math.floor(Math.random() * 10000) + 1,
            color: 'yellow',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'BNZ',
            price: Math.floor(Math.random() * 10000) + 1,
            color: 'green',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
    ];

    // Initialize a variable to store the total sum of prices
    let totalSum = 0;

    // Calculate to get the sum of prices from the pie chart
    for (let i = 0; i < pieData.length; i++) {
        totalSum += pieData[i].price;
    }

    pieData.sort((a, b) => b.price - a.price);

    let randomOriginalTotalPrice = Math.floor(Math.random() * 30000) + 10000; //Original prices

    let originalTotalPrice = randomOriginalTotalPrice;
    let changedTotalPrice = totalSum;

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const result = (originalTotalPrice, changedTotalPrice) => {
        return (changedTotalPrice - originalTotalPrice);
    }
    const resultValue = result(originalTotalPrice, changedTotalPrice);
    let percentage = ((resultValue / originalTotalPrice) * 100).toFixed(2);

    let moneyText = null;
    let percentageText = null;
    if (resultValue > 0) {
        moneyText = <Text style={styles.earnedMoney}>result: +{resultValue.toFixed(2)}</Text>;
        percentageText = <Text style={styles.earnedMoney}>{percentage}%</Text>
    } else {
        moneyText = <Text style={styles.losesMoney}>result: {resultValue.toFixed(2)}</Text>;
        percentageText = <Text style={styles.losesMoney}>{percentage}%</Text>
    }

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View style={styles.container}>
            <PieChart
                data={pieData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="price"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            <Text>Original assets: ${originalTotalPrice}</Text>
            <Text>Changed assets: ${changedTotalPrice}</Text>
            {moneyText}
            <Text>{percentageText}</Text>
            <Text>Stocks list: </Text>
            {/* Map through pieData and render StockCard for each stock */}
            {pieData.map((stock, index) => (
                <StockCard //stock card for the displaying stock
                    key={index}
                    name={stock.name}
                    price={stock.price}
                    color={stock.color}
                />
            ))}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkModeContainer: {
        backgroundColor: '#333', // Dark mode background color
    },
    earnedMoney: {
        color: 'blue',
    },
    darkModeEarnedMoney: {
        color: 'lightblue', // Dark mode text color
    },
    losesMoney: {
        color: 'red',
    },
    darkModeLosesMoney: {
        color: 'pink', // Dark mode text color
    },
    // Other styles
});

export default PortFolio;
