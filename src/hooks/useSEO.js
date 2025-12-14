import { useEffect } from 'react';

/**
 NOTA:
 * Hook personalizado para gestionar SEO en cada página
 * @param {Object} seoData - Datos de SEO
 * @param {string} seoData.title - Título de la página
 * @param {string} seoData.description - Descripción meta
 * @param {string} seoData.keywords - Palabras clave
 * @param {string} seoData.ogImage - Imagen Open Graph
 * @param {string} seoData.ogType - Tipo OG (website, article, etc)
 */
export const useSEO = ({
  title,
  description,
  keywords = 'restaurante, comida gourmet, Buenos Aires, Le Marc',
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  author = 'Le Marc Gourmet',
  robots = 'index, follow'
}) => {
  useEffect(() => {
    // Actualizar título
    document.title = title;

    // función para crear o actualizar meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // meta básicos
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', robots);

    // OG (Facebook, LinkedIn)
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:site_name', 'Le Marc Gourmet', 'property');

    // Twitter 
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Cleanup function (opcional...)
    return () => {
      // limpiar tags si lo necesit0...
    };
  }, [title, description, keywords, ogImage, ogType, author, robots]);
};

export default useSEO;