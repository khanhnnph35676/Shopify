import {Page, LegacyStack} from "@shopify/polaris";
import CustomSidebar from '../components/customSidebar.jsx'

export default function HomePage() {
  return (
    <Page fullWidth>
      <LegacyStack wrap={false}>
        <LegacyStack.Item>
          <CustomSidebar/>
        </LegacyStack.Item>
        <LegacyStack.Item>
          trang chu
        </LegacyStack.Item>
      </LegacyStack>
    </Page>
  )
}
