import {
  Card, Layout, Page, Box, Thumbnail, Text, LegacyStack,
  IndexTable, Button, Frame, Modal, TextContainer,
  LegacyCard,
  useIndexResourceState,
  Badge
} from "@shopify/polaris";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/node";
import {ProductIcon} from "@shopify/polaris-icons";
import {authenticate} from "../shopify.server";
import CustomSidebar from "../components/customSidebar.jsx";
import {Link, useNavigate} from "@remix-run/react";
import {useState, useCallback} from 'react';

export const loader = async ({request}) => {
  const {admin} = await authenticate.admin(request);
  const response = await admin.graphql(`
    #graphql
    query fetchProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            status
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `);
  const productsData = (await response.json()).data;
  return json({
    products: productsData.products.edges,
  });
};
export const action = async ({request}) => {
  const formData = new URLSearchParams(await request.text());
  const productIds = formData.getAll('productIds'); // Lấy ID sản phẩm từ formData

  const {admin} = await authenticate.admin(request);
  const results = await Promise.all(
    productIds.map(async (id) => {
      const response = await admin.graphql(`
        mutation productDelete($input: ProductDeleteInput!) {
          productDelete(input: $input) {
            deletedProductId
            userErrors {
              field
              message
            }
          }
        }
      `, {
        input: {id},
      });
      return await response.json();
    })
  );

  return json(results); // Trả về kết quả cho client
};
export default function Products() {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
// fomart status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  // loc id
  const extractShopifyId = (shopifyId) => {
    return shopifyId.split("/").pop();
  };
  const {products} = useLoaderData();
  const navigate = useNavigate();
  const resourceName = {
    singular: 'Product',
    plural: 'Products'
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(products);
  const handleDelete = async () => {

  };
  const rowMarkup = products.map(({node: product}, index) => (
    <IndexTable.Row
      id={product.id}
      key={product.id}
      selected={selectedResources.includes(product.id)}
      position={index}
      onClick={() => navigate(`/app/productdetail/${extractShopifyId(product.id)}`)}
    >
      <IndexTable.Cell>
        {product.featuredImage ? (
          <Thumbnail source={product.featuredImage.url} alt={product.featuredImage.altText}/>
        ) : (
          <Thumbnail source={ProductIcon} alt="Product"/>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="h5" variant="bodyMd">
          <Badge tone={
            product.status === 'ACTIVE' ? 'success' :
              product.status === 'DRAFT' ? 'info' :
                'subdued'
          }>
            {formatStatus(product.status)}
          </Badge>
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="h5" variant="bodyMd">
          {product.title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="h5" variant="bodyMd">
          {product.handle}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="h5" variant="bodyMd">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <Page fullWidth>
      <LegacyStack style={{display: 'flex'}} wrap={false}>
        <LegacyStack.Item>
          <CustomSidebar/>
        </LegacyStack.Item>
        <LegacyStack.Item fill>
          <Layout>
            <Layout.Section>
              <ui-title-bar title="Products">
                <button
                  variant="primary"
                  onClick={() => {
                    shopify.modal.show("create-products-modal");
                  }}
                >
                  Create a new product
                </button>
                {selectedResources.length > 0 && (
                  <button style={{marginBottom: '10px'}} onClick={handleChange}>
                    Delete selected products
                  </button>
                )}
              </ui-title-bar>
              <Layout>
                <Layout.Section>
                  <Card>
                    <IndexTable
                      resourceName={resourceName}
                      itemCount={products.length}
                      selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                      onSelectionChange={handleSelectionChange}
                      headings={[
                        {title: 'Image'},
                        {title: 'Status'},
                        {title: 'Title'},
                        {title: 'Handle'},
                        {title: 'Price'},
                      ]}
                    >
                      {rowMarkup}
                    </IndexTable>
                  </Card>
                </Layout.Section>
              </Layout>
            </Layout.Section>
          </Layout>
        </LegacyStack.Item>
      </LegacyStack>
      <div style={{height: '500px'}}>
        <Frame>
          <Modal
            open={active}
            onClose={handleChange}
            title="Reach more shoppers with Instagram product tags"
            primaryAction={{
              content: 'Delete',
              onAction: handleDelete,
            }}
            secondaryActions={[
              {
                content: 'Exit',
                onAction: handleChange,
              },
            ]}
          >
            <Modal.Section>
              <TextContainer>
                <p>
                  You are delete selected products?<br/>
                </p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </Frame>
      </div>
    </Page>

  );
}
