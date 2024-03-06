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
                    <View style={item_name.length > 40 ? styles?.mainItemNameBoxLong : styles?.mainItemNameBoxShort}>
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
                        <Text>
                            {
                                new Intl.NumberFormat('en-US', {
                                }).format(parseFloat(rate || 0).toFixed(2))
                            }
                        </Text>
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
                        <View style={styles?.mainItemTaxAmount}>
                            <Text>
                                {
                                    tax_id === 1 ? 
                                    new Intl.NumberFormat('en-US', {
                                    }).format(parseFloat((taxAmount || 0).toFixed(2)))
                                    : tax_id === 2 ? "0%" : "-"
                                }
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
                            {
                                new Intl.NumberFormat('en-US', {
                                }).format(parseFloat((amount || 0).toFixed(2)))
                            }
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

export default LineItem;
