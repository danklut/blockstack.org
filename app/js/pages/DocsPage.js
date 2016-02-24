'use strict'

import {Component}      from 'react'
import {Link}           from 'react-router'
import DocumentTitle    from 'react-document-title'
import marked           from 'marked'

import Header           from '../components/Header'
import Footer           from '../components/Footer'
import CardLink         from '../components/CardLink'
import docs             from '../../docs.json'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

class DocsPage extends Component {

  constructor(props) {
    super(props)

    this.initHighlighting = this.initHighlighting.bind(this)
    this.getPageProperties = this.getPageProperties.bind(this)
  }

  initHighlighting() {
    const blocks = document.querySelectorAll('pre code')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  }

  componentDidMount() {
    this.initHighlighting()
  }

  componentDidUpdate() {
    this.initHighlighting()
  }

  getPageProperties() {
    let pageName = '404'
    if (this.props.route.path === '/about') {
      pageName = 'about'
    } else if (this.props.routeParams.hasOwnProperty('docSection')) {
      if (docs.hasOwnProperty(this.props.routeParams.docSection)) {
        pageName = this.props.routeParams.docSection
      }
    }
    let pageProperties = docs[pageName]
    pageProperties.pageName = pageName

    let markup = marked(pageProperties.markdown)
    markup = markup.replace('<a href="', '<a target="_blank" href="')
    pageProperties.markupInnerHTML = {
      __html: markup
    }
    
    return pageProperties
  }

  render() {
    const pageProperties = this.getPageProperties(),
          nextSlug = pageProperties.hasOwnProperty('next') ? pageProperties.next : null,
          nextPage = nextSlug ? docs[nextSlug] : null

    return (
      <DocumentTitle title={`Blockstack - ${pageProperties.title}`}>
        <div>
          <div className="container-fluid col-centered navbar-fixed-top bg-primary">
            <Header />
          </div>
          <div className="m-b-3 docs-header-image-wrapper">
            <img src={pageProperties.image} className="img-fluid docs-header-image" />
          </div>
          { pageProperties.pageName !== 'about' ?
          <nav className="container-fluid m-b-1 back-docs">
            <ul className="pagination">
              <li className="page-item">
                <Link className="page-link" to="/docs" aria-label="Back">
                  <span aria-hidden="true">&laquo; Back to Docs</span>
                  <span className="sr-only">Back</span>
                </Link>
              </li>
            </ul>
          </nav>
          : null }
          <section className="m-b-5">
            <div className="container col-centered">
              <div className="container">
                <h1>{pageProperties.title}</h1>
                <div dangerouslySetInnerHTML={pageProperties.markupInnerHTML}>
                </div>
                {nextPage ?
                  <div className="row">
                    <div className="col-md-4">
                      <h3>Next Article</h3>
                      <CardLink href={`/docs/${nextSlug}`}
                        title={nextPage.title} body={nextPage.description}
                        imageSrc={nextPage.image} />
                    </div>
                  </div>
                : null }
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}

export default DocsPage
