import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const portFolio = () => {
    let originalTotalPrice = 10;
    let changedTotalPrice = 9.6;

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const result = (originalTotalPrice, changedTotalPrice) => {
        return changedTotalPrice - originalTotalPrice;
    }
    const resultValue = (result(originalTotalPrice, changedTotalPrice).toFixed(2));
    let moneyText = null;
    if (resultValue > 0) {
        moneyText = <Text style={styles.earnedMoney}>result: +{resultValue}</Text>;
    } else {
        moneyText = <Text style={styles.losesMoney}>result: {resultValue}</Text>;
    }

    let percentage = ((resultValue / originalTotalPrice) * 100).toFixed(2);

    const pieData = [
        {
            name: 'Stock 1',
            price: 215,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Stock 2',
            price: 280,
            color: 'blue',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Stock 3',
            price: 527612,
            color: 'red',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Stock 4',
            price: 853,
            color: '#ffffff',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: 'Stock 5',
            price: 1192,
            color: 'rgb(0, 0, 255)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
    ];
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
            <Text>Original money: {originalTotalPrice}</Text>
            <Text>Changed money: {changedTotalPrice}</Text>
            {moneyText}
            <Text>{percentage}%</Text>
        </View>
    );
}

export default portFolio;