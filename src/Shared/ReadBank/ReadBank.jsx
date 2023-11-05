import React from 'react'
import { View, Text, Tspan } from '@react-pdf/renderer'

const ReadBank = ({ styles, currency_abv, primary_bank, other_bank_accounts, subTotal, discount, tax, total }) => {
    return (
        <View style={styles.main}>
            <Text style={styles.mainHeading}>Bank Details</Text>
            <View style={styles.mainData}>
                <View style={styles.mainDataLeft}>
                    <View style={styles.mainDataLeftLeft}>
                        <View style={styles.mainDataLeftLeftLeft}>
                            <Text style={styles.bankText}>Bank Name</Text>
                            <Text style={styles.bankText}>Account Number</Text>
                            <Text style={styles.bankText}>Account Name</Text>
                            <Text style={styles.bankText}>IBAN ({primary_bank?.currency_abv} Acc)</Text>
                        </View>
                        <View style={styles.mainDataLeftLeftRight}>
                            <Text style={styles.bankText}>{primary_bank?.bank_name}</Text>
                            <Text style={styles.bankText}>{primary_bank?.account_number}</Text>
                            <Text style={styles.bankText}>{primary_bank?.account_holder_name}</Text>
                            <Text style={styles.bankText}>{primary_bank?.iban_number}</Text>
                        </View>
                    </View>
                    {
                        other_bank_accounts?.map((bank, index) => (
                            <View style={styles.mainDataLeftLeft} key={index}>
                                <View style={styles.mainDataLeftLeftLeft}>
                                    <Text style={styles.bankText}>Bank Name</Text>
                                    <Text style={styles.bankText}>Account Number</Text>
                                    <Text style={styles.bankText}>Account Name</Text>
                                    <Text style={styles.bankText}>IBAN ({bank?.currency_abv} Acc)</Text>
                                </View>
                                <View style={styles.mainDataLeftLeftRight}>
                                    <Text style={styles.bankText}>{bank?.bank_name}</Text>
                                    <Text style={styles.bankText}>{bank?.account_number}</Text>
                                    <Text style={styles.bankText}>{bank?.account_holder_name}</Text>
                                    <Text style={styles.bankText}>{bank?.iban_number}</Text>
                                </View>
                            </View>
                        ))
                    }
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
