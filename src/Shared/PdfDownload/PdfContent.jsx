import { useSelector } from 'react-redux';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import menuIcon from '../../assets/croppedIcon.png';
import WorkSans from '../../assets/fonts/WorkSans.ttf';
import WorkSansBold from '../../assets/fonts/WorkSansBold.ttf';
import WorkSansExtraBold from '../../assets/fonts/WorkSansExtraBold.ttf';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Work Sans',
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "110px",
    padding: "0 40px",
  },

  header__image: {
    display: "flex",
    alignItems: "center"
  },

  header__text: {
    display: "flex",
    fontWeight: 'bold',
    fontSize: "26px",
  },

  section: {
    marginBottom: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    backgroundColor: "#C9EFD8",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    height: "60px",
    padding: "0 40px",
  },

  footer__text: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  },
  footer__text_1: {
    fontWeight: 'normal',
    fontSize: "10px"
  },
  footer__text_2: {
    fontWeight: 'bold',
    paddingTop: "8px",
    fontSize: "10px"
  },
  footer__image: {
    width: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});


Font.register({
  family: 'Work Sans',
  fonts: [
    {
      src: WorkSans,
      fontWeight: 'normal',
    },
    {
      src: WorkSansBold,
      fontWeight: 'bold',
    },
    {
      src: WorkSansExtraBold,
      fontWeight: 'extraBold',
    },
  ],
});

const PdfContent = ({ contents, heading, logo }) => {
  const contentPerPage = 600; // Set the maximum height of content per page (adjust as needed)

  const pages = [];

  let currentPage = [];
  let currentHeight = 0;

  contents?.forEach((section) => {
    const sectionHeight = section.height;

    if (currentHeight + sectionHeight > contentPerPage) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(section)
    currentHeight += sectionHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <Document>
      {pages.map((pageContent, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.header__image}>
              <Image style={{ height: "60px", maxWidth: "120px", maxHeight: "60px" }} src={logo} alt="logo" />
            </View>
            <View style={styles.header__text}>
              <Text>{heading}</Text>
            </View>
          </View>

          {pageContent.map((section, i) => {
            const Component = section.component;
            const props = section.props;

            return (
              <Component {...props} />
            );

          })}

          <View style={styles.footer}>
            <View style={styles.footer__image}>
              <Image style={{ width: "60px" }} src={menuIcon} alt="logo" />
            </View>
            <View style={styles.footer__text}>
              <Text style={styles.footer__text_1}> This is electronically generated document and does not require sign or stamp. </Text>
              <Text style={styles.footer__text_2}> powered by Finaccru </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PdfContent;
