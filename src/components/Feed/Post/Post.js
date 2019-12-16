import React from 'react';

import Button from '../../Button/Button';
import './Post.css';

const post = props => (
  <article className="post">
    <header className="post__header">
      <h3 className="post__meta">
        Publicado por {props.author} el {props.date}
      </h3>
      <h1 className="post__title">{props.title}</h1>
    </header>
    {/* <div className="post__image">
      <Image imageUrl={props.image} contain />
    </div>
    <div className="post__content">{props.content}</div> */}
    <div className="post__actions">
      <Button mode="flat" link={props.id}>
        Ver publicación
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Editar
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Eliminar
      </Button>
    </div>
  </article>
);

export default post;
