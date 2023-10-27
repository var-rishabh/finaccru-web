import React from 'react'
import { View, Text } from '@react-pdf/renderer'
const EstimateTax = ({ styles, currency_abv, currency_conversion_rate, subTotal, discount, tax, total, groupedItems, terms_and_conditions }) => {
    return (
        <View style={styles.main}>
            <Text style={styles.mainHeading}>Tax Summary</Text>
            <Text style={styles.taxText}>(1 {currency_abv} = {currency_conversion_rate} AED)</Text>
            <View style={styles.mainData}>
                <View style={styles.mainTh}>
                    <Text style={styles.taxTextLeft}>Tax Details</Text>
                    <Text style={styles.taxTextRight}>Taxable Amount ({currency_abv})</Text>
                    <Text style={styles.taxTextRight}>Tax Amount ({currency_abv})</Text>
                    <Text style={styles.taxTextRight}>Total Amount ({currency_abv})</Text>
                </View>
                <View style={styles.mainTable}>
                    {groupedItems?.map((item, idx) => item.totalTaxAmount !== 0 && (
                        <View style={styles.mainTh} key={idx}>
                            <Text style={styles.taxTextLeft}>{item.tax_rate_name}</Text>
                            <Text style={styles.taxTextRight}>
                                {new Intl.NumberFormat('en-US', {
                                }).format(parseFloat(((item.taxable_amount) * (currency_conversion_rate || 1)).toFixed(2)))}
                            </Text>
                            <Text style={styles.taxTextRight}>
                                {new Intl.NumberFormat('en-US', {
                                }).format(parseFloat(((item.tax_amount) * (currency_conversion_rate || 1)).toFixed(2)))}
                            </Text>
                            <Text style={styles.taxTextRight}>
                                {new Intl.NumberFormat('en-US', {
                                }).format(parseFloat(((item.total_amount) * (currency_conversion_rate || 1)).toFixed(2)))}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.mainTh}>
                        <Text style={styles.totalTextLeft}>Total</Text>
                        <Text style={styles.totalTextRight}>
                            {new Intl.NumberFormat('en-US', {
                            }).format(parseFloat(((subTotal - discount) * (currency_conversion_rate || 1)).toFixed(2)))
                            }
                        </Text>
                        <Text style={styles.totalTextRight}>
                            {new Intl.NumberFormat('en-US', {
                            }).format(parseFloat(((tax) * (currency_conversion_rate || 1)).toFixed(2)))}
                        </Text>
                        <Text style={styles.totalTextRight}>
                            {new Intl.NumberFormat('en-US', {
                            }).format(parseFloat(((total) * (currency_conversion_rate || 1)).toFixed(2)))}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.main2}>
                {
                    terms_and_conditions ?
                        <View>
                            <View style={styles.main2Heading}>
                                <Text>Terms and Conditions</Text>
                            </View>
                            <View style={styles.main2Data}>
                                <Text>{terms_and_conditions}</Text>
                            </View>
                        </View>
                        : ""
                }
            </View>
        </View>
    )
}

export default EstimateTax;
