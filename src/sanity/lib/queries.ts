import { defineQuery } from "next-sanity";

/** Reusable GROQ projections. Images resolve to plain URL + metadata. */
const image = /* groq */ `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

const galleryImage = /* groq */ `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  caption,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

/** Portable Text with inline image assets dereferenced to URLs. */
const body = /* groq */ `"body": body[]{
  ...,
  _type == "galleryImage" => ${galleryImage}
}`;

const media = /* groq */ `
  "coverImage": coverImage${image},
  "gallery": gallery[defined(asset)]${galleryImage},
  "videos": videos[]{ url, title }
`;

const projectFields = /* groq */ `
  "id": _id,
  "slug": slug.current,
  title, summary, ${body}, techStack,
  "links": links[]{ label, url },
  startDate, endDate,
  "featured": coalesce(featured, false),
  ${media}
`;

const researchFields = /* groq */ `
  "id": _id,
  "slug": slug.current,
  title, summary, ${body}, areas, status, advisor, institution, publication,
  "links": links[]{ label, url },
  startDate, endDate,
  "featured": coalesce(featured, false),
  ${media}
`;

const conferenceFields = /* groq */ `
  "id": _id,
  "slug": slug.current,
  name, role, location, startDate, endDate, summary, ${body}, website,
  ${media}
`;

const listOrder = /* groq */ `order(coalesce(order, 9999) asc, startDate desc)`;

export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  name, headline, bio, location,
  "avatar": avatar${image},
  "resumeUrl": resume.asset->url,
  social, seoTitle, seoDescription
}`);

export const projectsQuery = defineQuery(
  `*[_type == "project" && defined(slug.current) && (!$featuredOnly || featured == true)] | ${listOrder}{${projectFields}}`,
);
export const projectBySlugQuery = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{${projectFields}}`,
);

export const researchQuery = defineQuery(
  `*[_type == "research" && defined(slug.current) && (!$featuredOnly || featured == true)] | ${listOrder}{${researchFields}}`,
);
export const researchBySlugQuery = defineQuery(
  `*[_type == "research" && slug.current == $slug][0]{${researchFields}}`,
);

export const experienceQuery = defineQuery(`*[_type == "experience"] | order(startDate desc){
  "id": _id, role, organization, organizationUrl, location, employmentType,
  startDate, endDate, summary, highlights, techStack,
  "logo": logo${image}
}`);

export const conferencesQuery = defineQuery(
  `*[_type == "conference" && defined(slug.current)] | order(startDate desc){${conferenceFields}}`,
);
export const conferenceBySlugQuery = defineQuery(
  `*[_type == "conference" && slug.current == $slug][0]{${conferenceFields}}`,
);

export const skillsQuery = defineQuery(
  `*[_type == "skill"] | order(category asc, coalesce(order, 9999) asc, name asc){
    "id": _id, name, category, proficiency
  }`,
);

export const educationQuery = defineQuery(`*[_type == "education"] | order(startDate desc){
  "id": _id, institution, degree, field, location, startDate, endDate, gpa, highlights,
  "logo": logo${image}
}`);

export const hobbiesQuery =
  defineQuery(`*[_type == "hobby"] | order(coalesce(order, 9999) asc, name asc){
  "id": _id, name, description,
  "image": image${image},
  "gallery": gallery[defined(asset)]${galleryImage}
}`);
