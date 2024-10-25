import {json} from "@remix-run/node";
import {authenticate} from "../shopify.server";

export const action = async ({request}) => {
  const {admin} = await authenticate.admin(request);
  const formData = await request.json();

  const selectedProductIds = formData.get['id'];

  const results = [];
  for (const id of selectedProductIds) {
    const response = await admin.graphql(`
      mutation {
        productDelete(input: { id: "${id}" }) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `);
    results.push(await response.json());
  }
  hs
  return json(results);
};
