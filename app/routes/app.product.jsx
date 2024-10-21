import React from 'react';
import {Page, LegacyStack, Card, Layout} from "@shopify/polaris";
import CustomSidebar from '../components/customSidebar.jsx'
import List from '../components/product/list.jsx';
import '../components/css/style.css'

export default function Product() {
  return (
    <Page fullWidth>
      <LegacyStack wrap={false}>
        <LegacyStack.Item>
          <CustomSidebar/>
        </LegacyStack.Item>
        <LegacyStack.Item fill>
          <Card>
            <Layout>
              <Layout.Section>
                <List/>
              </Layout.Section>
            </Layout>
          </Card>
        </LegacyStack.Item>
      </LegacyStack>
    </Page>
  )
}
