import { View, Text } from '@react-pdf/renderer'

const StatementSummary = ({ styles, start_date, end_date, opening_balance, invoiced_amount, amount_received, exchange_gain, balance_due }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainSummary}>
                <Text style={styles.summaryHeading}>Statement Summary</Text>
                <Text style={styles.summarySubHeading}>From {start_date} to {end_date}</Text>
            </View>
            <View style={styles.summaryInfo}>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Opening Balance</Text>
                    <Text style={styles.summaryInfoData}>{opening_balance}</Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> + </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Invoiced Amount</Text>
                    <Text style={styles.summaryInfoData}>{invoiced_amount}</Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Amount Received</Text>
                    <Text style={styles.summaryInfoData}>{amount_received}</Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Exchange Gain</Text>
                    <Text style={styles.summaryInfoData}>{exchange_gain}</Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> = </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Balance Due</Text>
                    <Text style={styles.summaryInfoData}>{balance_due}</Text>
                </View>
            </View>
        </View>
    )
}

export default StatementSummary;
