import { RequestOptions } from "./zustand";

function curl(props: RequestOptions) {
  const params =
    props.parameters?.map(([key, val]) => `${key}=${val}`).join("&") || "";
  const headers: string[] =
    props.headers?.map(([k, v]) => `-H "${k}: ${v}"`) || [];
  const body = props.body ? `'${props.body}'` : "";
  if (props.authorisation) {
    if (
      props.authorisation.auth_type === "bearer" &&
      props.authorisation.values.token
    ) {
      headers.push(
        `-H "Authorization: Bearer ${props.authorisation.values.token}"`,
      );
    } else if (
      props.authorisation.auth_type === "basic" &&
      props.authorisation.values.username &&
      props.authorisation.values.password
    ) {
      const encoded = btoa(
        `${props.authorisation.values.username}:${props.authorisation.values.password}`,
      );
      headers.push(`-H "Authorization: Basic ${encoded}"`);
    }
  }

  return `
    curl -X ${props.method} "${props.url}?${params}" ${headers} --data ${body}
  `.trim();
}

function axios(props: RequestOptions) {
  const params =
    props.parameters?.map(([key, val]) => `${key}=${val}`).join("&") || "";
  const body = props.body ? `${props.body}` : null;

  const headers: Record<string, string> =
    props.headers?.reduce(
      (acc, [k, v]) => {
        acc[k] = v;
        return acc;
      },
      {} as Record<string, string>,
    ) || {};

  if (props.authorisation) {
    if (
      props.authorisation.auth_type === "bearer" &&
      props.authorisation.values.token
    ) {
      headers["Authorization"] = `Bearer ${props.authorisation.values.token}`;
    } else if (
      props.authorisation.auth_type === "basic" &&
      props.authorisation.values.username &&
      props.authorisation.values.password
    ) {
      const encoded = btoa(
        `${props.authorisation.values.username}:${props.authorisation.values.password}`,
      );
      headers["Authorization"] = `Basic ${encoded}`;
    }
  }

  return `
    import axios from "axios";

    axios({
      method: "${props.method}",
      url: "${props.url}${params ? `?${params}` : ""}",
      headers: ${JSON.stringify(headers, null, 2)}${
        body ? `,\n      data: ${body}` : ""
      }
    }).then(res => {
      console.log(res.data);
    }).catch(console.error);
  `.trim();
}

function fetch(props: RequestOptions) {
  const params =
    props.parameters?.map(([key, val]) => `${key}=${val}`).join("&") || "";
  const body = props.body ? `${props.body}` : null;

  const headers: Record<string, string> =
    props.headers?.reduce(
      (acc, [k, v]) => {
        acc[k] = v;
        return acc;
      },
      {} as Record<string, string>,
    ) || {};

  if (props.authorisation) {
    if (
      props.authorisation.auth_type === "bearer" &&
      props.authorisation.values.token
    ) {
      headers["Authorization"] = `Bearer ${props.authorisation.values.token}`;
    } else if (
      props.authorisation.auth_type === "basic" &&
      props.authorisation.values.username &&
      props.authorisation.values.password
    ) {
      const encoded = btoa(
        `${props.authorisation.values.username}:${props.authorisation.values.password}`,
      );
      headers["Authorization"] = `Basic ${encoded}`;
    }
  }

  return `
    fetch("${props.url}${params ? `?${params}` : ""}", {
      method: "${props.method}",
      headers: ${JSON.stringify(headers, null, 2)}${
        body ? `,\n      body: ${body}` : ""
      }
    })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
  `.trim();
}

function request(props: RequestOptions) {
  const params =
    props.parameters
      ?.map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
      )
      .join("&") || "";
  const query = params ? `?${params}` : "";
  const body = props.body ? props.body : null;

  const headers: Record<string, string> =
    props.headers?.reduce(
      (acc, [k, v]) => {
        acc[k] = v;
        return acc;
      },
      {} as Record<string, string>,
    ) || {};

  if (props.authorisation) {
    if (
      props.authorisation.auth_type === "bearer" &&
      props.authorisation.values.token
    ) {
      headers["Authorization"] = `Bearer ${props.authorisation.values.token}`;
    } else if (
      props.authorisation.auth_type === "basic" &&
      props.authorisation.values.username &&
      props.authorisation.values.password
    ) {
      const encoded = Buffer.from(
        `${props.authorisation.values.username}:${props.authorisation.values.password}`,
      ).toString("base64");
      headers["Authorization"] = `Basic ${encoded}`;
    }
  }

  return `
    import requests
    
    url = "${props.url}${query}"
    headers = ${JSON.stringify(headers, null, 2)}${
        body
          ? `
    
    data = ${body}`
          : ""
      }
    
    response = requests.${props.method.toLowerCase()}(
        url, headers=headers${body ? ", data=data" : ""}
    )
  
  print(response.text)
  `.trim();
}

export default function generate(props: RequestOptions) {
  return [
    {
      name: "curl",
      code: curl(props)
    },
    {
      name: "axios",
      code: axios(props)
    },
    {
      name: "fetch",
      code: fetch(props)
    },
    {
      name: "request",
      code: request(props)
    }
  ]
}
