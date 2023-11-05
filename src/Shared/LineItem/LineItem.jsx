import React from 'react'
import { View, Text } from '@react-pdf/renderer'

const LineItem = ({ styles, item_name, unit, qty, rate, discount, is_percentage_discount, tax_id, taxAmount, taxRateName, amount, description, index }) => {
    return (
        <View style={styles?.main} key={index}>
            <View style={styles?.mainWholeItem}>
                <View style={styles?.mainItemName}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Item Name</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemNameBox}>
                        <Text>{item_name}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemUnit}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Unit</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemUnitBox}>
                        <Text>{unit}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemQty}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Qty</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemQtyBox}>
                        <Text>{qty}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemRate}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Rate</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemRateBox}>
                        <Text>{rate}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemDiscount}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Discount</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemDiscountBox}>
                        <View style={styles?.mainItemDiscountAmount}>
                            <Text>{discount}</Text>
                        </View>
                        <View style={styles?.mainItemDiscountType}>
                            <Text >
                                {is_percentage_discount ? '%' : '$'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles?.mainItemTax}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>Tax</Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemTaxBox}>
                        <View style={tax_id == 1 ? styles?.mainItemTaxAmount : styles?.mainItemTaxAmountNS}>
                            <Text>
                                {taxAmount}
                            </Text>
                        </View>
                        <View style={tax_id == 1 ? styles?.mainItemTaxType : styles?.mainItemTaxTypeNS}>
                            <Text>
                                {taxRateName == "Standard Rated (5%)" ? "5%" : taxRateName}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles?.mainItemAmount}>
                    {index === 0 ?
                        <View style={styles?.mainItemHeading}>
                            <Text>
                                Amount
                            </Text>
                        </View> :
                        <View></View>
                    }
                    <View style={styles?.mainItemAmountBox}>
                        <Text>
                            {amount}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles?.mainItemDescription}>
                {description ? (
                    <View style={styles?.mainItemDescriptionBox}>
                        <View style={styles?.mainItemDescriptionHeading}>
                            <Text>Description</Text>
                        </View>
                        <View style={styles?.mainItemDescriptionData}>
                            <Text>{description} </Text>
                        </View>
                    </View>
                ) : <View></View>}
            </View>
        </View >
    )
}

export default LineItem
