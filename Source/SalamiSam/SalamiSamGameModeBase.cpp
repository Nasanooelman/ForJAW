// Copyright Epic Games, Inc. All Rights Reserved.


#include "SalamiSamGameModeBase.h"
#include "PlayerHUD.h"
#include "CPlayerController.h"

ASalamiSamGameModeBase::ASalamiSamGameModeBase()
{
	DefaultPawnClass = ABasicPlayer::StaticClass();
	HUDClass = APlayerHUD::StaticClass();
	PlayerControllerClass = ACPlayerController::StaticClass();
}

