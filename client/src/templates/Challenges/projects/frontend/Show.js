import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Col, Row } from '@freecodecamp/react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import { ChallengeNode } from '../../../../redux/propTypes';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  updateSolutionFormValues
} from '../../redux';
import { getGuideUrl } from '../../utils';

import LearnLayout from '../../../../components/layouts/Learn';
import ChallengeTitle from '../../components/Challenge-Title';
import ChallengeDescription from '../../components/Challenge-Description';
import Spacer from '../../../../components/helpers/Spacer';
import SolutionForm from '../SolutionForm';
import ProjectToolPanel from '../Tool-Panel';
import CompletionModal from '../../components/CompletionModal';
import HelpModal from '../../components/HelpModal';
import Hotkeys from '../../components/Hotkeys';

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateChallengeMeta,
      challengeMounted,
      updateSolutionFormValues,
      openCompletionModal: () => openModal('completion')
    },
    dispatch
  );

const propTypes = {
  challengeMounted: PropTypes.func.isRequired,
  data: PropTypes.shape({
    challengeNode: ChallengeNode
  }),
  openCompletionModal: PropTypes.func.isRequired,
  pageContext: PropTypes.shape({
    challengeMeta: PropTypes.object
  }),
  updateChallengeMeta: PropTypes.func.isRequired,
  updateSolutionFormValues: PropTypes.func.isRequired
};

export class Project extends Component {
  componentDidMount() {
    const {
      challengeMounted,
      data: {
        challengeNode: { title, challengeType }
      },
      pageContext: { challengeMeta },
      updateChallengeMeta
    } = this.props;
    updateChallengeMeta({ ...challengeMeta, title, challengeType });
    challengeMounted(challengeMeta.id);
    this._container.focus();
  }

  componentDidUpdate(prevProps) {
    const {
      data: {
        challengeNode: { title: prevTitle }
      }
    } = prevProps;
    const {
      challengeMounted,
      data: {
        challengeNode: { title: currentTitle, challengeType }
      },
      pageContext: { challengeMeta },
      updateChallengeMeta
    } = this.props;
    if (prevTitle !== currentTitle) {
      updateChallengeMeta({
        ...challengeMeta,
        title: currentTitle,
        challengeType
      });
      challengeMounted(challengeMeta.id);
    }
  }

  render() {
    const {
      data: {
        challengeNode: {
          challengeType,
          fields: { blockName },
          forumTopicId,
          title,
          description
        }
      },
      openCompletionModal,
      pageContext: {
        challengeMeta: { introPath, nextChallengePath, prevChallengePath }
      },
      updateSolutionFormValues
    } = this.props;

    const blockNameTitle = `${blockName} - ${title}`;

    return (
      <Hotkeys
        innerRef={c => (this._container = c)}
        introPath={introPath}
        nextChallengePath={nextChallengePath}
        prevChallengePath={prevChallengePath}
      >
        <LearnLayout>
          <Helmet title={`${blockNameTitle} | Learn | freeCodeCamp.org`} />
          <Grid>
            <Row>
              <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
                <Spacer />
                <ChallengeTitle>{blockNameTitle}</ChallengeTitle>
                <ChallengeDescription description={description} />
                <SolutionForm
                  challengeType={challengeType}
                  description={description}
                  onSubmit={openCompletionModal}
                  updateSolutionForm={updateSolutionFormValues}
                />
                <ProjectToolPanel
                  guideUrl={getGuideUrl({ forumTopicId, title })}
                />
                <br />
                <Spacer />
              </Col>
              <CompletionModal blockName={blockName} />
              <HelpModal />
            </Row>
          </Grid>
        </LearnLayout>
      </Hotkeys>
    );
  }
}

Project.displayName = 'Project';
Project.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project);

export const query = graphql`
  query ProjectChallenge($slug: String!) {
    challengeNode(fields: { slug: { eq: $slug } }) {
      forumTopicId
      title
      description
      challengeType
      fields {
        blockName
        slug
      }
    }
  }
`;
