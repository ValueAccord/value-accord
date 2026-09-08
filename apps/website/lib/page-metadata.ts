import type { Metadata } from 'next';

export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  return {
    title: `${title} | Value Accord`,
    description,
    alternates: { canonical: `https://valueaccord.com${pathname}` },
  };
}
