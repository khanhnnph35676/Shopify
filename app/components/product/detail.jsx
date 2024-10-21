import {
  Page,
  LegacyCard,
  TextField,
  Grid,
  Thumbnail,
  Text,
  LegacyStack,
  DropZone,
  Select
}
  from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import React, {useState, useCallback} from 'react';
import '../css/style.css';

// import {Link, useNavigate} from "@remix-run/react";
export default function Detail() {
  // category
  const [selected, setSelected] = useState('');

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );
  const options = [
    {label: 'Today', value: 'today'},
    {label: 'Yesterday', value: 'yesterday'},
    {label: 'Last 7 days', value: 'lastWeek'},
  ];


  // upload image
  const [files, setFiles] = useState([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png"/>
  );

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteIcon
            }
          />
          <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (newValue) => setValue(newValue),
    [],
  );
  return (
    <>
      <Page
        backAction={{content: 'Product Detail', url: '/app/product'}}
        title="Product Detail"
        // subtitle="Perfect for any pet"
        compactTitle
        primaryAction={{content: 'Save'}}
        secondaryActions={[
          {
            content: 'Duplicate',
            accessibilityLabel: 'Secondary action label',
            onAction: () => alert('Duplicate action'),
          },
          {
            content: 'View on your store',
            onAction: () => alert('View on your store action'),
          },
        ]}
      >
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 8, xl: 8}}>
            <LegacyCard sectioned>
              <TextField label="Title" value={value} onChange={handleChange} autoComplete="off"
                         placeholder='Name product'/>
              <br/>
              <DropZone onDrop={handleDropZoneDrop} variableHeight label='Media'>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
              <br/>
              <Select
                label="Category"
                options={options}
                onChange={handleSelectChange}
                value={selected}
              />
              <br/>
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
            <LegacyCard title="Orders" sectioned>
              <p>View a summary of your online store’s orders.</p>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </>
  );
}
