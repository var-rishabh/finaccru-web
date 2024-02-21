import { View, Text } from '@react-pdf/renderer'
import moment from 'moment';

const StatementSummary = ({ styles, start_date, end_date, opening_balance, invoiced_amount, amount_received, credit_notes, balance_due }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainSummary}>
                <Text style={styles.summaryHeading}>Statement Summary</Text>
                <Text style={styles.summarySubHeading}>From {moment(start_date).format('DD-MM-YYYY')}</Text>
                <Text style={styles.summarySubHeading}>To {moment(end_date).format('DD-MM-YYYY')}</Text>
            </View>
            <View style={styles.summaryInfo}>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Opening Balance</Text>
                    <Text style={styles.summaryInfoData}>
                        {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(opening_balance).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> + </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Invoiced Amount</Text>
                    <Text style={styles.summaryInfoData}>
                        {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(invoiced_amount).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Payment Received</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(amount_received).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Credit Notes</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(credit_notes).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> = </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Balance Due</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(balance_due).toFixed(2))}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default StatementSummary;
