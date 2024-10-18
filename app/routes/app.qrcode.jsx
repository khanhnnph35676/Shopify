import {json} from "@remix-run/node";
import {useLoaderData, Link, useNavigate} from "@remix-run/react";
import {authenticate} from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
  Pagination,

} from "@shopify/polaris";

import {getQRCodes} from "../models/QRCode.server";
import {AlertDiamondIcon, ImageIcon} from "@shopify/polaris-icons";
import './_index/qrcode.css';
import React, {useState} from "react";

const itemsPerPage = 5;

export async function loader({request}) {
  const {admin, session} = await authenticate.admin(request);
  const qrCodes = await getQRCodes(session.shop, admin.graphql);

  return json({
    qrCodes,
  });
}

const EmptyQRCodeState = ({onAction}) => (
  <EmptyState
    heading="Create unique QR codes for your product"
    action={{
      content: "Create QR code",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to scan codes and buy products using their phones.</p>
  </EmptyState>
);

function truncate(str, {length = 25} = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const QRTable = ({qrCodes}) => (
  <IndexTable
    resourceName={{
      singular: "QR code",
      plural: "QR codes",
    }}
    itemCount={qrCodes.length}
    headings={[
      {title: "Thumbnail", hidden: true},
      {title: "Title"},
      {title: "Product"},
      {title: "Date created"},
      {title: "Scans"},
    ]}
    selectable={false}
  >
    {qrCodes.map((qrCode) => (
      <QRTableRow key={qrCode.id} qrCode={qrCode}/>
    ))}
  </IndexTable>
);

const QRTableRow = ({qrCode}) => (
// const navigate = useNavigate();
//   <Link to={`/app/qrcodes/${qrCode.id}`}>
  <IndexTable.Row id={qrCode.id} position={qrCode.id}>
    <IndexTable.Cell>
      <Thumbnail
        source={qrCode.productImage || ImageIcon}
        alt={qrCode.productTitle}
        size="small"
      />
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`/app/qrcodes/${qrCode.id}`}>
        {truncate(qrCode.title)}
      </Link>
    </IndexTable.Cell>
    <IndexTable.Cell>
      {qrCode.productDeleted ? (
        <InlineStack align="start" gap="200">
          <span style={{width: "20px"}}>
            <Icon source={AlertDiamondIcon} tone="critical"/>
          </span>
          <Text tone="critical" as="span">
            product has been deleted
          </Text>
        </InlineStack>

      ) : (
        truncate(qrCode.productTitle)
      )}
    </IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(qrCode.createdAt).toDateString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{qrCode.scans}</IndexTable.Cell>
  </IndexTable.Row>
  // </Link>
);

export default function Index() {
  const {qrCodes} = useLoaderData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredQRCodes = qrCodes.filter(qrCode =>
    qrCode.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const totalPages = Math.ceil(filteredQRCodes.length / itemsPerPage);

  // Lấy dữ liệu QRCode cho trang hiện tại
  const paginatedQRCodes = filteredQRCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm xử lý khi nhấn nút phân trang
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const customStyles = {
    button: {
      padding: '10px 20px',
      margin: '0 5px',
      cursor: 'pointer',
      fontSize: '16px', // Tăng kích thước văn bản
    },
  };
  return (
    <Page>
      <input
        type="text"
        className='form-control'
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />
      <ui-title-bar title="QR codes">
        <button variant="primary" onClick={() => navigate("/app/qrcodes/new")}>
          Create QR code
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {/*{qrCodes.length === 0 ? (*/}
            {/*  <EmptyQRCodeState onAction={() => navigate("/qrcode")}/>*/}
            {/*) : (*/}
            {/*  <QRTable qrCodes={qrCodes}/>*/}
            {/*)}*/}
            {filteredQRCodes.length === 0 ? (
              <EmptyQRCodeState onAction={() => navigate("/qrcode")}/>
            ) : (
              < div>
                <QRTable qrCodes={paginatedQRCodes}/>
                <div style={{
                  display: 'flex',
                  alignItems: "center",
                  gap: '10px',
                  margin: '20px',
                  paddingBottom: '10px',

                }}>
                  <span>Page {currentPage} / {totalPages}</span>
                  <Pagination style={{background: '#333'}}
                              hasPrevious={currentPage > 1}
                              onPrevious={handlePreviousPage}
                              hasNext={currentPage < totalPages}
                              onNext={handleNextPage}
                  />
                </div>
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
