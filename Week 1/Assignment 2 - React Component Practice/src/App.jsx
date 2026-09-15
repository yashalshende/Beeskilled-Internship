import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Button from './components/Button';
import Form from './components/Form';
import yashalPhoto from './assets/yashal-shende.jpg';
import './App.css';

export default function App() {
  // ---------------------------------------------------------------------------
  // State Demonstrations
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'composition' | 'docs'
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState('No actions yet. Click any button!');
  const [activeCardVariant, setActiveCardVariant] = useState('elevated');
  const [submittedForms, setSubmittedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ---------------------------------------------------------------------------
  // Navigation Configuration (Passed to Header via Props)
  // ---------------------------------------------------------------------------
  const navItems = [
    { id: 'lab', label: 'Component Playground', icon: '🧪' },
    { id: 'composition', label: 'Full Composition Demo', icon: '🎨' },
    { id: 'docs', label: 'Architecture & Props API', icon: '📚' },
  ];

  // ---------------------------------------------------------------------------
  // Dynamic Data for Cards (Demonstrating Dynamic Rendering via .map())
  // ---------------------------------------------------------------------------
  const sampleProjects = [
    {
      id: 1,
      title: 'AUTHENTIX — Deepfake Diagnostic',
      subtitle: 'Explainable AI & Forensic Vision Pipeline',
      badge: 'Explainable AI',
      badgeVariant: 'primary',
      tags: ['Python', 'Flask', 'PyTorch', 'Grad-CAM', 'SHAP'],
      description: 'End-to-end framework interpreting facial boundary artifacts using saliency maps and SHAP summary plots.',
    },
    {
      id: 2,
      title: 'ServiceIQ / HVAC Sahayak AI',
      subtitle: 'Field Technician AI Copilot',
      badge: 'RAG Architecture',
      badgeVariant: 'accent',
      tags: ['FastAPI', 'React', 'Ollama', 'LLaMA', 'Docker'],
      description: 'Technician copilot enforcing deterministic JSON responses with local LLM retrieval over equipment manuals.',
    },
    {
      id: 3,
      title: 'MunicipalMate Nagpur',
      subtitle: 'Civic Governance Portal',
      badge: 'Full Stack MERN',
      badgeVariant: 'success',
      tags: ['React.js', 'Node.js', 'Express', 'Tailwind', 'REST'],
      description: 'Citizen grievance workflow tracking and utility billing system built for the Nagpur civic administration.',
    },
  ];

  // ---------------------------------------------------------------------------
  // Reusable Form Field Schemas (Passed to Form via Props)
  // ---------------------------------------------------------------------------
  const feedbackFormFields = [
    {
      name: 'reviewerName',
      label: 'Your Name',
      type: 'text',
      placeholder: 'e.g. Senior Evaluator',
      required: true,
      validate: (val) => (val && val.length < 2 ? 'Name must be at least 2 characters.' : null),
    },
    {
      name: 'evaluationRole',
      label: 'Evaluation Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Technical Mentor', value: 'mentor' },
        { label: 'Frontend Architect', value: 'architect' },
        { label: 'QA Engineer', value: 'qa' },
        { label: 'Peer Reviewer', value: 'peer' },
      ],
    },
    {
      name: 'rating',
      label: 'Component Architecture Score (1 to 10)',
      type: 'select',
      required: true,
      options: [
        { label: '⭐⭐⭐⭐⭐ 10/10 - Exceptional Reusability', value: '10' },
        { label: '⭐⭐⭐⭐ 9/10 - Exceeds Expectations', value: '9' },
        { label: '⭐⭐⭐⭐ 8/10 - Solid Implementation', value: '8' },
      ],
    },
    {
      name: 'comments',
      label: 'Review Comments',
      type: 'textarea',
      placeholder: 'Provide your feedback regarding props, state, events, and dynamic rendering...',
      required: true,
      rows: 3,
      validate: (val) => (val && val.length < 10 ? 'Feedback must be at least 10 characters.' : null),
    },
    {
      name: 'approved',
      label: 'I certify that all 5 required components meet internship standards.',
      type: 'checkbox',
      required: true,
    },
  ];

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------
  const handleButtonClick = (actionName) => {
    setClickCount((prev) => prev + 1);
    setLastAction(`Triggered: ${actionName} at ${new Date().toLocaleTimeString()}`);
  };

  const handleFormSubmit = async (formData) => {
    // Simulate async network latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmittedForms((prev) => [
      {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setLastAction(`Form submitted by ${formData.reviewerName}!`);
  };

  // ---------------------------------------------------------------------------
  // Footer Sections Data (Passed via Props)
  // ---------------------------------------------------------------------------
  const footerSections = [
    {
      title: 'Components',
      links: [
        { label: 'Header Component', href: '#lab' },
        { label: 'Footer Component', href: '#lab' },
        { label: 'Card Component', href: '#lab' },
        { label: 'Button Component', href: '#lab' },
        { label: 'Form Component', href: '#lab' },
      ],
    },
    {
      title: 'Internship',
      links: [
        { label: 'BeeSkilled MERN Track', href: 'https://github.com/yashalshende/Beeskilled-Internship' },
        { label: 'Week 1 Requirements', href: 'https://github.com/yashalshende/Beeskilled-Internship' },
        { label: 'GitHub Repository', href: 'https://github.com/yashalshende/Beeskilled-Internship' },
      ],
    },
  ];

  const footerSocials = [
    { label: 'GitHub', href: 'https://github.com/yashalshende' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yashal-shende-9072b22a5' },
    { label: 'Email', href: 'mailto:shendeyashal@gmail.com' },
  ];

  return (
    <div className="app-root">
      {/* ====================================================================
          1. HEADER COMPONENT (Demonstrating Props, State & Navigation Events)
          ==================================================================== */}
      <Header
        brand={{
          title: 'BeeSkilled UI Lab',
          subtitle: 'Assignment 2 • React Component Practice',
          logo: <span>⚛️</span>,
        }}
        navItems={navItems}
        activeId={activeTab}
        onNavSelect={(id) => setActiveTab(id)}
        actionsSlot={
          <div className="header-status-slot">
            <span className="event-badge">Clicks: {clickCount}</span>
            <Button
              size="sm"
              variant="outline"
              label="Reset Stats"
              onClick={() => {
                setClickCount(0);
                setLastAction('Counter reset.');
              }}
            />
          </div>
        }
      />

      <main className="app-main-content">
        {/* ==================================================================
            TAB 1: COMPONENT PLAYGROUND & INTERACTIVE LAB
            ================================================================== */}
        {activeTab === 'lab' && (
          <section className="section-container">
            <header className="page-header">
              <span className="tag-pill">Assignment 2 Specification</span>
              <h1 className="page-title">Reusable React Components Playground</h1>
              <p className="page-lead">
                Live interactive showcase demonstrating that <strong>Header</strong>, <strong>Footer</strong>, <strong>Card</strong>, <strong>Button</strong>, and <strong>Form</strong> are genuinely reusable, accept dynamic props, manage internal state, respond to synthetic events, and render dynamically.
              </p>
            </header>

            {/* Live Action Tracker Banner */}
            <div className="live-event-banner" role="status">
              <span className="live-indicator">●</span>
              <strong>Live Event Feed:</strong>
              <span>{lastAction}</span>
            </div>

            {/* --------------------------------------------------------------
                A. BUTTON COMPONENT PRACTICE
                -------------------------------------------------------------- */}
            <div className="lab-card-panel">
              <div className="panel-header">
                <h2>1. Reusable Button Component (`Button.jsx`)</h2>
                <p>Demonstrates props: <code>variant</code>, <code>size</code>, <code>icon</code>, <code>loading</code>, <code>disabled</code>, and <code>onClick</code> event.</p>
              </div>

              <div className="panel-grid-group">
                <div>
                  <h4 className="subheading">Variants (via `variant` prop):</h4>
                  <div className="flex-row">
                    <Button
                      variant="primary"
                      label="Primary Action"
                      onClick={() => handleButtonClick('Primary Button')}
                    />
                    <Button
                      variant="secondary"
                      label="Secondary"
                      onClick={() => handleButtonClick('Secondary Button')}
                    />
                    <Button
                      variant="outline"
                      label="Outline"
                      onClick={() => handleButtonClick('Outline Button')}
                    />
                    <Button
                      variant="ghost"
                      label="Ghost"
                      onClick={() => handleButtonClick('Ghost Button')}
                    />
                    <Button
                      variant="danger"
                      label="Danger"
                      onClick={() => handleButtonClick('Danger Button')}
                    />
                    <Button
                      variant="success"
                      label="Success"
                      onClick={() => handleButtonClick('Success Button')}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="subheading">Sizes &amp; States (via `size`, `loading`, `disabled`, `icon` props):</h4>
                  <div className="flex-row">
                    <Button
                      size="sm"
                      label="Small (sm)"
                      onClick={() => handleButtonClick('Small Button')}
                    />
                    <Button
                      size="md"
                      label="Medium (md)"
                      onClick={() => handleButtonClick('Medium Button')}
                    />
                    <Button
                      size="lg"
                      label="Large (lg)"
                      onClick={() => handleButtonClick('Large Button')}
                    />
                    <Button
                      variant="primary"
                      loading={true}
                      label="Loading State"
                    />
                    <Button
                      variant="secondary"
                      disabled={true}
                      label="Disabled State"
                    />
                    <Button
                      variant="outline"
                      icon="🚀"
                      label="With Icon"
                      onClick={() => handleButtonClick('Icon Button')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------
                B. CARD COMPONENT PRACTICE
                -------------------------------------------------------------- */}
            <div className="lab-card-panel">
              <div className="panel-header">
                <h2>2. Reusable Card Component (`Card.jsx`)</h2>
                <p>Demonstrates dynamic props: <code>variant</code>, <code>title</code>, <code>subtitle</code>, <code>badge</code>, <code>tags</code>, <code>image</code>, and children.</p>
                <div className="variant-switch-row">
                  <span>Switch Card Variant:</span>
                  {['default', 'elevated', 'interactive', 'product'].map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={activeCardVariant === v ? 'primary' : 'outline'}
                      label={v}
                      onClick={() => setActiveCardVariant(v)}
                    />
                  ))}
                </div>
              </div>

              <div className="cards-preview-grid">
                {/* Profile Card Variant */}
                <Card
                  variant={activeCardVariant}
                  image={yashalPhoto}
                  imageAlt="Yashal Shende Portrait"
                  badge="Candidate Profile"
                  badgeVariant="primary"
                  title="Yashal Sharadrao Shende"
                  subtitle="MCA Candidate • Ramdeobaba University"
                  tags={['MERN Stack', 'Applied AI', 'Explainable AI']}
                  footerAction={
                    <Button
                      size="sm"
                      variant="primary"
                      label="View Full Profile"
                      onClick={() => handleButtonClick('Card Action: View Profile')}
                    />
                  }
                >
                  <p>
                    Specializing in React.js, Node.js, and RAG copilot workflows. Graduated Gondwana University with 8.36 CGPA.
                  </p>
                </Card>

                {/* Interactive Project Card */}
                <Card
                  variant={activeCardVariant}
                  badge="Deepfake Forensics"
                  badgeVariant="accent"
                  title="AUTHENTIX Framework"
                  subtitle="Explainable AI Diagnostic Engine"
                  tags={['Python', 'Grad-CAM', 'SHAP', 'LIME', 'PyTorch']}
                  onClick={() => handleButtonClick('Clicked Card: AUTHENTIX')}
                  footerAction={
                    <span className="card-hint-text">👆 Click card to trigger onClick event</span>
                  }
                >
                  <p>
                    Inspects video &amp; image manipulations with spatial-temporal analysis and explainability heatmaps.
                  </p>
                </Card>

                {/* E-Commerce Product Card Variant */}
                <Card
                  variant={activeCardVariant}
                  badge="Services Tier"
                  badgeVariant="success"
                  title="AI / RAG Integration Scope"
                  subtitle="Turnkey LLM & Vector Pipeline"
                  tags={['Ollama', 'FastAPI', 'Vector DB', 'Docker']}
                  footerAction={
                    <Button
                      size="sm"
                      variant={selectedProduct === 'RAG Scope' ? 'success' : 'outline'}
                      label={selectedProduct === 'RAG Scope' ? '✓ Selected' : 'Select Package'}
                      onClick={() => {
                        setSelectedProduct('RAG Scope');
                        handleButtonClick('Selected Product: RAG Scope');
                      }}
                    />
                  }
                >
                  <p>
                    Enterprise integration of local LLMs, manual retrieval indexing, and structured JSON generation.
                  </p>
                </Card>
              </div>
            </div>

            {/* --------------------------------------------------------------
                C. FORM COMPONENT PRACTICE
                -------------------------------------------------------------- */}
            <div className="lab-card-panel">
              <div className="panel-header">
                <h2>3. Reusable Form Component (`Form.jsx`)</h2>
                <p>Demonstrates internal state management (<code>values</code>, <code>errors</code>, <code>touched</code>, <code>isSubmitting</code>), live validation, dynamic input generation, and <code>onSubmit</code> event.</p>
              </div>

              <div className="form-demo-layout">
                <div className="form-container-box">
                  <Form
                    title="Internship Component Evaluation Form"
                    description="Fill out the fields below. Validations run on blur and input change events."
                    fields={feedbackFormFields}
                    submitLabel="Submit Evaluation Feedback"
                    onSubmit={handleFormSubmit}
                  />
                </div>

                <div className="submissions-log-box">
                  <h3>Dynamic State Feed: Submissions ({submittedForms.length})</h3>
                  {submittedForms.length === 0 ? (
                    <div className="empty-feed">
                      <p>No feedback submitted yet.</p>
                      <p className="empty-sub">Fill in the form to the left to test state updates and dynamic rendering!</p>
                    </div>
                  ) : (
                    <div className="submissions-list">
                      {submittedForms.map((item) => (
                        <div key={item.id} className="submission-item">
                          <div className="submission-head">
                            <strong>{item.reviewerName}</strong>
                            <span className="timestamp">{item.submittedAt}</span>
                          </div>
                          <p className="sub-role">Role: <code>{item.evaluationRole}</code> • Score: <strong>{item.rating}/10</strong></p>
                          <p className="sub-comment">"{item.comments}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            TAB 2: FULL COMPOSITION DEMO
            ================================================================== */}
        {activeTab === 'composition' && (
          <section className="section-container">
            <header className="page-header">
              <span className="tag-pill">Full Layout Composition</span>
              <h1 className="page-title">Dynamic Rendering &amp; Component Synthesis</h1>
              <p className="page-lead">
                Demonstrating all 5 components working synergistically in a cohesive application layout without hardcoded elements.
              </p>
            </header>

            <div className="sample-projects-wrapper">
              <h2 className="section-heading">Featured Projects Rendered Dynamically via `.map()`</h2>
              <div className="projects-grid-comp">
                {sampleProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="elevated"
                    badge={project.badge}
                    badgeVariant={project.badgeVariant}
                    title={project.title}
                    subtitle={project.subtitle}
                    tags={project.tags}
                    footerAction={
                      <div className="footer-action-row">
                        <Button
                          size="sm"
                          variant="outline"
                          label="GitHub"
                          onClick={() => handleButtonClick(`View ${project.title} Repo`)}
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          label="Inspect Specs"
                          onClick={() => handleButtonClick(`Inspect ${project.title}`)}
                        />
                      </div>
                    }
                  >
                    <p>{project.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            TAB 3: ARCHITECTURE & PROPS API DOCS
            ================================================================== */}
        {activeTab === 'docs' && (
          <section className="section-container">
            <header className="page-header">
              <span className="tag-pill">Technical Specification</span>
              <h1 className="page-title">Component Architecture &amp; Props Reference</h1>
              <p className="page-lead">
                Formal technical breakdown of the 5 required reusable components adhering strictly to Week 1 criteria.
              </p>
            </header>

            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Props Demonstrated</th>
                    <th>State Demonstrated</th>
                    <th>Events Demonstrated</th>
                    <th>Dynamic Rendering</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Header.jsx</strong></td>
                    <td><code>brand</code>, <code>navItems</code>, <code>activeId</code>, <code>onNavSelect</code>, <code>actionsSlot</code></td>
                    <td><code>isMobileOpen</code> (hamburger drawer)</td>
                    <td><code>onClick</code>, <code>onNavSelect</code>, window resize listener</td>
                    <td>Navigation items dynamically rendered via <code>navItems.map()</code></td>
                  </tr>
                  <tr>
                    <td><strong>Footer.jsx</strong></td>
                    <td><code>brandTitle</code>, <code>tagline</code>, <code>sections</code>, <code>socialLinks</code>, <code>copyrightText</code></td>
                    <td>Stateless / Controlled</td>
                    <td><code>onClick</code> for smooth scroll to top</td>
                    <td>Link columns &amp; social items dynamically rendered via <code>sections.map()</code></td>
                  </tr>
                  <tr>
                    <td><strong>Card.jsx</strong></td>
                    <td><code>variant</code>, <code>image</code>, <code>badge</code>, <code>title</code>, <code>subtitle</code>, <code>tags</code>, <code>footerAction</code></td>
                    <td>Controlled / Stateless</td>
                    <td><code>onClick</code>, <code>onKeyDown</code> (accessibility)</td>
                    <td>Tech tags array rendered via <code>tags.map()</code>; conditional image/badge slots</td>
                  </tr>
                  <tr>
                    <td><strong>Button.jsx</strong></td>
                    <td><code>label</code>, <code>variant</code>, <code>size</code>, <code>disabled</code>, <code>loading</code>, <code>icon</code>, <code>fullWidth</code></td>
                    <td>Visual state (hover, active, busy)</td>
                    <td><code>onClick</code> event with propagation suppression when disabled</td>
                    <td>Dynamic spinner rendering &amp; conditional icon injection</td>
                  </tr>
                  <tr>
                    <td><strong>Form.jsx</strong></td>
                    <td><code>title</code>, <code>description</code>, <code>fields</code> config, <code>initialValues</code>, <code>onSubmit</code></td>
                    <td><code>values</code>, <code>errors</code>, <code>touched</code>, <code>isSubmitting</code>, <code>statusBanner</code></td>
                    <td><code>onChange</code>, <code>onBlur</code>, <code>onSubmit</code></td>
                    <td>Form controls (text, email, select, textarea, checkbox) generated via <code>fields.map()</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ====================================================================
          2. FOOTER COMPONENT (Demonstrating Props, Links & Back-to-Top Event)
          ==================================================================== */}
      <Footer
        brandTitle="BeeSkilled Component Practice Lab"
        tagline="Built strictly with React, Vite, and modern CSS architecture by Yashal Shende."
        sections={footerSections}
        socialLinks={footerSocials}
        showBackToTop={true}
      />
    </div>
  );
}
