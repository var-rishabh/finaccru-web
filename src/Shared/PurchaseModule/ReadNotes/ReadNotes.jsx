import { View, Text, Tspan } from '@react-pdf/renderer'

const ReadBank = ({ styles, currency_abv, notes, subTotal, discount, tax, total }) => {
    return (
        <View style={styles.main}>
            <Text style={styles.mainHeading}>Note</Text>
            <View style={styles.mainData}>
                <View style={styles.mainDataLeft}>
                    <Text style={styles.notes}>{notes}</Text>
                </View>
                <View style={styles.mainDataRight}>
                    <View style={styles.mainDataRightLeft}>
                        <Text style={styles.statsText}>Sub Total</Text>
                        <Text style={styles.statsText}>Discount</Text>
                        <Text style={styles.statsText}>Tax</Text>
                        <Text style={styles.statsText}>Total</Text>
                    </View>
                    <View style={styles.mainDataRightRight}>
                        <Text style={styles.statsTextValue}><Tspan style={styles.statsCurrency}>{currency_abv}</Tspan> &nbsp; {subTotal}</Text>
                        <Text style={styles.statsTextValue}><Tspan style={styles.statsCurrency}>{currency_abv}</Tspan> &nbsp; {discount}</Text>
                        <Text style={styles.statsTextValue}><Tspan style={styles.statsCurrency}>{currency_abv}</Tspan> &nbsp; {tax}</Text>
                        <Text style={styles.statsTextValue}><Tspan style={styles.statsCurrency}>{currency_abv}</Tspan> &nbsp; {total}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReadBank;
