import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './controller.reducer';

export interface IControllerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ControllerDetail = (props: IControllerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { controllerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="controllerDetailsHeading">Controller</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{controllerEntity.id}</dd>
          <dt>
            <span id="uuid">Uuid</span>
          </dt>
          <dd>{controllerEntity.uuid}</dd>
        </dl>
        <Button tag={Link} to="/controller" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/controller/${controllerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ controller }: IRootState) => ({
  controllerEntity: controller.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ControllerDetail);
