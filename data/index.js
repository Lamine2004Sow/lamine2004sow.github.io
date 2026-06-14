/* Assemble tous les modules en window.PORTFOLIO_DATA.
   Ce fichier doit être chargé EN DERNIER dans index.html. */

window.PORTFOLIO_DATA = {
  name: window._dcIdentity.name,
  role: window._dcIdentity.role,
  nav:  window._dcIdentity.nav,
  ui:   window._dcIdentity.ui,

  about:        window._dcAbout,
  cv:           window._dcCV,
  skills:       window._dcSkills,
  contact:      window._dcContact,
  demos:        window._dcDemos,
  publications: window._dcPublications,

  projects: {
    ...window._dcProjectsMeta,
    items: window._dcProjects,
  },
};
