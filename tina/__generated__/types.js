export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SitePartsFragmentDoc = gql`
    fragment SiteParts on Site {
  __typename
  meta {
    __typename
    title
    description
  }
  logo {
    __typename
    label
    accent
  }
  navigation {
    __typename
    label
    href
    cta
  }
  topContact {
    __typename
    phoneLabel
    phoneHref
    emailLabel
    emailHref
    whatsappLabel
    whatsappHref
  }
  hero {
    __typename
    eyebrow
    title
    subtitle
    primaryCta
    secondaryCta
    image
  }
  benefits {
    __typename
    title
    body
  }
  servicesSection {
    __typename
    eyebrow
    title
    lead
  }
  services {
    __typename
    title
    body
    cta
    reverse
    before {
      __typename
      src
      alt
      label
      objectPosition
    }
    after {
      __typename
      src
      alt
      label
      objectPosition
    }
  }
  why {
    __typename
    eyebrow
    title
    lead
    items {
      __typename
      icon
      title
      body
    }
  }
  contact {
    __typename
    eyebrow
    title
    lead
    fields {
      __typename
      name
      label
      type
      placeholder
      full
      required
    }
    submitLabel
    successMessage
    web3forms {
      __typename
      accessKey
      subject
      fromName
      ccEmail
    }
  }
  footer {
    __typename
    brand {
      __typename
      label
      accent
    }
    copy
    phoneLabel
    phoneHref
    emailLabel
    emailHref
    whatsappLabel
    whatsappHref
  }
}
    `;
export const SiteDocument = gql`
    query site($relativePath: String!) {
  site(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SiteParts
  }
}
    ${SitePartsFragmentDoc}`;
export const SiteConnectionDocument = gql`
    query siteConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteFilter) {
  siteConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SiteParts
      }
    }
  }
}
    ${SitePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    site(variables, options) {
      return requester(SiteDocument, variables, options);
    },
    siteConnection(variables, options) {
      return requester(SiteConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/2.4/content/bf437fba-d60c-427e-87f3-cd38cba906b3/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
