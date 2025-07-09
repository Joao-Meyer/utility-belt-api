import { PlaylistVisibility } from '@domain/enum';
import { yup } from '@infra/yup';
import {
  booleanNotRequired,
  enumTypeNotRequired,
  enumTypeRequired,
  numberNotRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '@main/utils';
import { array } from 'yup';

export type playlistQueryFields = 'name';

export const playlistListQueryFields: playlistQueryFields[] = ['name'];

export type userPlaylistQueryFields = 'name';

export const userPlaylistListQueryFields: userPlaylistQueryFields[] = ['name'];

export const insertPlaylistSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringRequired(255),
    imageUrl: stringNotRequired(),
    parentId: numberNotRequired().integer(),
    visibility: enumTypeRequired({ data: PlaylistVisibility })
  })
});

export const insertPlaylistItemSchema = yup.object().shape({
  body: yup.object().shape({
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer()
  })
});

export const updatePlaylistSchema = yup.object().shape({
  body: yup.object().shape({
    name: stringNotRequired(255),
    imageUrl: stringNotRequired(),
    visibility: enumTypeNotRequired({ data: PlaylistVisibility })
  })
});

export const updatePlaylistItemSchema = yup.object().shape({
  body: yup.object().shape({
    playlistId: numberNotRequired().integer(),
    movieId: numberNotRequired().integer(),
    seriesId: numberNotRequired().integer()
  })
});

export const userPlaylistItemSchema = yup.object().shape({
  body: yup.object().shape({
    users: array().of(
      yup.object().shape({
        id: numberRequired().integer(),
        isCollaborator: booleanNotRequired()
      })
    )
  })
});

export const deleteUserPlaylistItemSchema = yup.object().shape({
  body: yup.object().shape({
    users: array().of(numberRequired().integer()).min(1)
  })
});
