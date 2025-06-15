import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAndStore(term: string) {
    const response = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}`
    );
    const results = response.data.results;

    const saved = await Promise.all(
      results.map(async (item: any) => {
        if (!item.trackId) return null;

        try {
          return await this.prisma.searchResult.upsert({
            where: { trackId: item.trackId },
            update: {},
            create: {
              wrapperType: item.wrapperType || null,
              kind: item.kind || null,
              collectionId: item.collectionId || null,
              trackId: item.trackId,
              artistName: item.artistName || null,
              collectionName: item.collectionName || null,
              trackName: item.trackName || null,
              collectionCensoredName: item.collectionCensoredName || null,
              trackCensoredName: item.trackCensoredName || null,
              collectionViewUrl: item.collectionViewUrl || null,
              feedUrl: item.feedUrl || null,
              trackViewUrl: item.trackViewUrl || null,
              artworkUrl30: item.artworkUrl30 || null,
              artworkUrl60: item.artworkUrl60 || null,
              artworkUrl100: item.artworkUrl100 || null,
              artworkUrl600: item.artworkUrl600 || null,
              collectionPrice: item.collectionPrice || null,
              trackPrice: item.trackPrice || null,
              collectionHdPrice: item.collectionHdPrice || null,
              releaseDate: item.releaseDate ? new Date(item.releaseDate) : null,
              collectionExplicitness: item.collectionExplicitness || null,
              trackExplicitness: item.trackExplicitness || null,
              trackCount: item.trackCount || null,
              trackTimeMillis: item.trackTimeMillis || null,
              country: item.country || null,
              currency: item.currency || null,
              primaryGenreName: item.primaryGenreName || null,
              contentAdvisoryRating: item.contentAdvisoryRating || null,
              genreIds: item.genreIds ? JSON.stringify(item.genreIds) : null,
              genres: item.genres ? JSON.stringify(item.genres) : null,
            },
          });
        } catch (err) {
          console.error(`Error saving trackId ${item.trackId}:`, err);
          return null;
        }
      })
    );

    return saved.filter(Boolean);
  }
}
